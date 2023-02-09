import {
  Detail,
  ActionPanel,
  Action,
  getPreferenceValues,
  LaunchProps,
  Toast,
  showToast,
  open,
  popToRoot,
} from "@raycast/api";
import parse from "url-parse";
import { Preferences } from "./types/global";
import { PostResponse } from "./types/request";
import { getMe, sendMemo } from "./utils/api";

interface TodoArguments {
  text: string;
}

export default function Command(props: LaunchProps<{ arguments: TodoArguments }>) {
  const preferences = getPreferenceValues<Preferences>();
  const { openApi } = preferences;
  const { text = "" } = props.arguments;

  getMe();

  const { isLoading, data } = sendMemo({
    content: text,
  });

  function openWeb(data: PostResponse) {
    const { protocol, host } = parse(openApi);
    const url = `${protocol}//${host}/m/${data.data.id}`;
    open(url);
  }

  setTimeout(() => {
    popToRoot({ clearSearchBar: true });
  }, 3000);

  return (
    <Detail
      isLoading={isLoading}
      markdown={data?.data?.id ? "# Success" : "# Error"}
      actions={
        data && (
          <ActionPanel>
            <Action title="Open web" onAction={() => openWeb(data)} />
          </ActionPanel>
        )
      }
    />
  );
}
