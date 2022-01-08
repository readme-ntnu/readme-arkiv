export type ISubmitFunction = (
  valuesToSubmit: IEditArticle,
  statusFunctions: {
    setSubmitting: (value: boolean) => void;
    setStatus: ({
      success,
      error,
    }: {
      success?: boolean;
      error?: boolean;
    }) => void;
  }
) => void;

export interface IEditArticle {
  author: string;
  title: string;
  content: string;
  editionYear: number;
  editionNumber: number;
  layout: string;
  pages: string;
  photo: string;
  tags: string;
  type: string;
  url: string;
}
