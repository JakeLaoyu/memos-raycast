import { Detail, ActionPanel, Action, getPreferenceValues, LaunchProps, Toast, showToast, open } from "@raycast/api";
import { useFetch } from "@raycast/utils";
import parse from "url-parse";
import { Preferences } from "./types/global";
import { PostResponse } from "./types/request";

interface TodoArguments {
  text: string;
}

export default function Command(props: LaunchProps<{ arguments: TodoArguments }>) {
  const preferences = getPreferenceValues<Preferences>();
  const { openApi } = preferences;
  const { text } = props.arguments;

  const { isLoading, data } = useFetch<PostResponse>(openApi, {
    method: "Post",
    body: JSON.stringify({
      content: text,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!text) {
    showToast({
      style: Toast.Style.Failure,
      title: "Please enter text",
    });

    return <Detail markdown="Please enter text" />;
  }

  function openWeb(data: PostResponse) {
    const { protocol, host } = parse(openApi);
    const url = `${protocol}//${host}/m/${data.data.id}`;
    open(url);
  }

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
