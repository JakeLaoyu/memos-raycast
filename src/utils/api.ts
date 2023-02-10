import { getPreferenceValues, Cache } from "@raycast/api";
import { useFetch } from "@raycast/utils";
import fetch from "cross-fetch";
import parse from "url-parse";
import { Preferences } from "../types/global";
import { MeResponse, PostResponse, TagResponse } from "../types/request";

const cache = new Cache();

const parseResponse = async (response: Response) => {
  const cookie = response.headers.get("Set-Cookie");
  console.log("set cookie", cookie);
  if (cookie) {
    cache.set("cookie", cookie);
  }
  const data = await response.json();
  return data;
};

const getOpenApi = () => {
  const preferences = getPreferenceValues<Preferences>();

  const { openApi } = preferences;
  return openApi;
};

const getRequestUrl = (path = "") => {
  const { origin } = parse(getOpenApi());
  const url = `${origin}${path}`;
  return url;
};

const getOpenId = () => {
  const { query } = parse(getOpenApi());
  const parseQuery = parse.qs.parse(query);

  return parseQuery.openId;
};

const getUseFetch = <T>(url: string, options: Record<string, any>) => {
  return useFetch<T>(url, {
    headers: {
      "Content-Type": "application/json",
      cookie: cache.get("cookie") || "",
    },
    parseResponse,
    ...options,
  });
};

export const getMe = () => {
  return getUseFetch<MeResponse>(getRequestUrl(`/api/user/me?openId=${getOpenId()}`), {});
};

export const sendMemo = (data: Record<string, any> = {}) => {
  return fetch(getOpenApi(), {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  }).then(parseResponse);
};

export const getTags = () => {
  const url = getRequestUrl(`/api/tag?openId=${getOpenId()}`);

  return getUseFetch<TagResponse>(url, {});
};
