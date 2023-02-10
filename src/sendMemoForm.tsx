import { Form, Detail, ActionPanel, Action, showToast, Toast } from "@raycast/api";
import { useState } from "react";
import { PostFileResponse, PostMemoParams } from "./types/request";

import { getTags, postFile, sendMemo } from "./utils/api";
import { VISIBILITY } from "./utils/constant";

interface FormData {
  content: string;
  files: string[];
  tags: string[];
  visibility: keyof typeof VISIBILITY;
}

export default function SendMemoFormCommand(): JSX.Element {
  const { isLoading, data: existTags } = getTags();

  const [nameError, setNameError] = useState<string | undefined>();
  const [files, setFiles] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>();

  function dropNameErrorIfNeeded() {
    if (nameError && nameError.length > 0) {
      setNameError(undefined);
    }
  }

  const onSubmit = async (values: FormData) => {
    console.log("onSubmit", values);
    const { content, files, tags, visibility } = values;

    const params = {
      content,
      visibility,
    } as PostMemoParams;

    if (tags?.length) {
      params.content += ` #${tags.join(" #")}`;
    }

    if (files.length) {
      showToast({
        style: Toast.Style.Animated,
        title: "Upload Files",
      });

      const postFilesPromiseArr: Promise<PostFileResponse>[] = [];

      files.forEach((file) => {
        postFilesPromiseArr.push(postFile(file));
      });

      const uploadedFiles = await Promise.all(postFilesPromiseArr).catch(() => {
        showToast(Toast.Style.Failure, "Upload Files Failed");
      });

      console.log("uploadedFiles", uploadedFiles);

      if (uploadedFiles) {
        params.resourceIdList = uploadedFiles.map((file) => file.data.id);
      }
    }

    showToast({
      style: Toast.Style.Animated,
      title: "Sending Memo",
    });

    console.log("params", params);

    const res = await sendMemo(params).catch(() => {
      showToast(Toast.Style.Failure, "Send Memo Failed");
    });

    console.log("res", res);

    if (res) {
      showToast(Toast.Style.Success, "Send Memo Success");
    }
  };

  return (
    <Form
      isLoading={isLoading}
      actions={
        <ActionPanel>
          <Action.SubmitForm onSubmit={onSubmit} />
        </ActionPanel>
      }
    >
      <Form.TextArea
        id="content"
        title="Content"
        placeholder="Enter Content"
        error={nameError}
        onChange={dropNameErrorIfNeeded}
        onBlur={(event) => {
          if (event.target.value?.length == 0) {
            setNameError("The field should't be empty!");
          } else {
            dropNameErrorIfNeeded();
          }
        }}
      />

      <Form.FilePicker id="files" value={files} onChange={setFiles} />

      <Form.TagPicker id="tags" title="Exist Tags" value={tags} onChange={setTags}>
        {existTags?.data?.map((tag) => {
          return <Form.TagPicker.Item key={tag} value={tag} title={tag} />;
        })}
      </Form.TagPicker>

      <Form.Dropdown id="visibility" title="Limit" defaultValue="PRIVATE">
        {Object.keys(VISIBILITY).map((key) => {
          return <Form.Dropdown.Item key={key} value={key} title={VISIBILITY[key as keyof typeof VISIBILITY]} />;
        })}
      </Form.Dropdown>
    </Form>
  );
}
