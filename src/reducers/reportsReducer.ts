export interface IReportState {
  payload: any[] | null;
  loading: Boolean;
  error: {} | null;
}

export enum ReportActions {
  CALL_API = "call-api",
  SUCCESS = "success",
  ERROR = "error",
}

interface IReportAction {
  type: ReportActions;
  payload: any[];
  error: string;
}

export const reportDetailsReducer = (
  state: IReportState,
  action: IReportAction
) => {
  const { type, payload, error } = action;
  switch (type) {
    case ReportActions.CALL_API:
      return {
        ...state,
        loading: true,
      };
    case ReportActions.SUCCESS:
      return {
        ...state,
        loading: false,
        payload,
      };
    case ReportActions.ERROR:
      return {
        ...state,
        loading: false,
        error,
      };
    default:
      return state;
  }
};
