import { Form } from "@raycast/api";
import { useState } from "react";

import { getTags } from "./utils/api";
import { VISIBILITY } from "./utils/constant";

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

  return (
    <Form isLoading={isLoading}>
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

      <Form.TextField id="tag" title="New Tag" />

      <Form.Dropdown id="visibility" title="Limit" defaultValue="PRIVATE">
        {Object.keys(VISIBILITY).map((key) => {
          return <Form.Dropdown.Item key={key} value={key} title={VISIBILITY[key as keyof typeof VISIBILITY]} />;
        })}
      </Form.Dropdown>
    </Form>
  );
}
