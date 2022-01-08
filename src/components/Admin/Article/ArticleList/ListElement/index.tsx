import { FC } from "react";
import { Link } from "react-router-dom";

import * as ROUTES from "../../../../../constants/routes";
import { DeleteButton } from "../../../Common/DeleteButton";
import { IArticleListData } from "../../types";

import styles from "./ListElement.module.css";

interface ListElementProps {
  obj: IArticleListData;
  removeSelf: (obj: IArticleListData) => void;
}

export const ListElement: FC<ListElementProps> = ({ obj, removeSelf }) => {
  const { data, ref, id } = obj;
  const { edition, title, url } = data;
  return (
    <div className={styles.elementStyle}>
      <p>
        {edition} | {title}
      </p>
      <div className={styles.end}>
        <a href={url} target="_blank" rel="noopener noreferrer">
          <i className={`material-icons md-36 ${styles.open}`}>
            remove_red_eye
          </i>
        </a>
        <Link to={ROUTES.EDIT_ARTICLE.replace(":id", id)}>
          <i className={`material-icons md-36 ${styles.edit}`}>edit</i>
        </Link>
        <DeleteButton docRef={ref} removeSelf={() => removeSelf(obj)} />
      </div>
    </div>
  );
};
