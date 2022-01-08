import { FC } from "react";
import { Loading } from "../../../Loading";

interface RowLoaderProps {
  minHeight: number;
}

export const RowLoader: FC<RowLoaderProps> = ({ minHeight }) => {
  return (
    <Loading
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: `${minHeight}px`,
        marginBottom: "15px",
      }}
    />
  );
};
