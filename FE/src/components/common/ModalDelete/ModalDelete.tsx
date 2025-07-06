import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import React from "react";
import { EMPTY_STRING } from "@/utils/constants/common";
import { useTranslation } from "react-i18next";

type Props = {
  tableIdDelete: string;
  setTableIdDelete: (value: string) => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
};

const DialogDelete = ({
  tableIdDelete,
  setTableIdDelete,
  onConfirm,
  title,
  description,
}: Props) => {
  const { t } = useTranslation();
  return (
    <Dialog
      open={Boolean(tableIdDelete)}
      onOpenChange={(value) => {
        if (!value) {
          setTableIdDelete(EMPTY_STRING);
        }
      }}
    >
      <DialogContent className="sm:max-w-md flex flex-col items-center gap-4">
        <div className="bg-red-800/20 p-4 rounded-full">
          <Trash2 className="w-8 h-8 text-red-500" />
        </div>

        <DialogHeader className="flex justify-center items-center">
          <DialogTitle className="text-xl font-semibold text-gray-400">
            {title || t("common_title_delete")}
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-400">
            {description || t("common_des_delete")}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex w-full  lg:justify-center gap-4">
          <DialogClose asChild>
            <Button
              type="button"
              variant="outline"
              className="bg-gray-700 text-white hover:bg-gray-600"
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            variant="destructive"
            onClick={() => {
              onConfirm?.();
              setTableIdDelete(EMPTY_STRING);
            }}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default React.memo(DialogDelete);
