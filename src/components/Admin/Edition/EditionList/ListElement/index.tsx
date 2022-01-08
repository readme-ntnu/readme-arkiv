import { FC } from "react";

import styles from "./ListElement.module.css";
import { IEditionListData } from "../../../../Firebase/firebase";
import { DeleteButton } from "../../../Common/DeleteButton";

interface ListElementProps {
  obj: IEditionListData;
  removeSelf: () => void;
}

export const ListElement: FC<ListElementProps> = ({ obj, removeSelf }) => {
  const refs = [obj.imgRef, obj.pdfRef];

  return (
    <div className={styles.elementStyle}>
      <p>{obj.edition}</p>
      <DeleteButton storageRef={refs} removeSelf={() => removeSelf()} />
    </div>
  );
};
