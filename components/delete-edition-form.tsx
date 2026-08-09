"use client";

import { deleteEdition } from "@/app/offices/actions";

type DeleteEditionFormProps = {
  editionId: string;
  editionTitle: string;
};

export function DeleteEditionForm({
  editionId,
  editionTitle,
}: DeleteEditionFormProps) {
  return (
    <form
      action={deleteEdition}
      onSubmit={(event) => {
        const confirmed = window.confirm(
          `Delete "${editionTitle}"?\n\nThis cannot be undone.`
        );

        if (!confirmed) {
          event.preventDefault();
        }
      }}
    >
      <input
        type="hidden"
        name="editionId"
        value={editionId}
      />

      <button type="submit">
        Delete
      </button>
    </form>
  );
}