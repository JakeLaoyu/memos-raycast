import { useEffect, useState } from "react";
import { List, ActionPanel, Action, open } from "@raycast/api";
import { getAllMemos, getRequestUrl } from "./api";
import { MemoInfoResponse } from "./types";

export default function MemosListCommand(): JSX.Element {
  const [searchText, setSearchText] = useState("");
  const { isLoading, data } = getAllMemos();
  const [filterList, setFilterList] = useState<MemoInfoResponse[]>([]);

  useEffect(() => {
    setFilterList(data?.data?.filter((item) => item.content.includes(searchText)) || []);
  }, [searchText]);

  useEffect(() => {
    setFilterList(data?.data || []);
  }, [data]);

  function openItem(item: MemoInfoResponse) {
    console.log(`${item} selected`);
    const url = getRequestUrl(`/m/${item.id}`);

    open(url);
  }

  function getItemMarkdown(item: MemoInfoResponse) {
    const { content, resourceList } = item;
    let markdown = content;

    resourceList.forEach((resource, index) => {
      const resourceUrl = getRequestUrl(`/o/r/${resource.id}/${resource.filename}`);

      if (index === 0) {
        markdown += "\n\n";
      }

      markdown += ` ![${resource.filename}](${resourceUrl})`;
    });

    return markdown;
  }

  return (
    <List
      isLoading={isLoading}
      filtering={false}
      onSearchTextChange={setSearchText}
      navigationTitle="Search Memos"
      searchBarPlaceholder="Search your memo..."
      isShowingDetail
    >
      {filterList.map((item) => (
        <List.Item
          key={item.id}
          title={item.content}
          actions={
            <ActionPanel>
              <Action title="Open web" onAction={() => openItem(item)} />
            </ActionPanel>
          }
          detail={<List.Item.Detail markdown={getItemMarkdown(item)} />}
        />
      ))}
    </List>
  );
}
