export interface IEdition {
  editionYear: number;
  editionNumber: number;
  editionFile?: File;
  listingslop: boolean;
}

export type ISubmitEditionFunction = (
  valuesToSubmit: IEdition,
  statusFunctions: {
    setSubmitting: (value: boolean) => void;
    setStatus: ({
      success,
      error,
    }: {
      success?: boolean;
      error?: boolean;
      progress?: number;
    }) => void;
  }
) => void;
