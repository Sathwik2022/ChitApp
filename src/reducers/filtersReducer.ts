export interface IFilterState {
  filterDate: string;
  fromDate: Date | null;
  toDate: Date | null;
  singleDay: Date | null;
}

export enum FilterActions {
  TODAY = "today",
  YESTERDAY = "yesterday",
  DAY = "day",
  THIS_MONTH = "month",
  LAST_MONTH = "last-month",
  CUSTOM = "custom",
  FROM_DATE = "from-date",
  TO_DATE = "to-date",
  SINGLE_DAY = "single-day",
  RESET = "reset",
}

interface IFilterPayload {
  fdate: Date | null;
  tdate: Date | null;
  selectOption: string;
}
interface IFilterAction {
  type: FilterActions;
  payload: IFilterPayload | {};
}

export const filtersReducer = (state: IFilterState, action: IFilterAction) => {
  const { type, payload } = action;
  switch (type) {
    case FilterActions.TODAY:
      const p = payload as IFilterPayload;
      return {
        ...state,
        filterDate: p.selectOption,
        singleDay: new Date(),
        fromDate: null,
        toDate: null,
      };
    case FilterActions.YESTERDAY:
      const yesterday = new Date();
      const p2 = payload as IFilterPayload;
      return {
        ...state,
        filterDate: p2.selectOption,
        singleDay: new Date(yesterday.setDate(yesterday.getDate() - 1)),
        fromDate: null,
        toDate: null,
      };

    case FilterActions.DAY:
      const p3 = payload as IFilterPayload;
      return {
        ...state,
        filterDate: p3.selectOption,
        singleDay: p3.fdate,
        fromDate: null,
        toDate: null,
      };

    case FilterActions.THIS_MONTH:
      const p4 = payload as IFilterPayload;
      return {
        ...state,
        filterDate: p4.selectOption,
        fromDate: null,
        toDate: null,
        singleDay: null,
      };

    case FilterActions.LAST_MONTH:
      const p5 = payload as IFilterPayload;
      return {
        ...state,
        filterDate: p5.selectOption,
        singleDay: null,
        fromDate: null,
        toDate: null,
      };

    case FilterActions.CUSTOM:
      const p6 = payload as IFilterPayload;
      return {
        ...state,
        singleDay: null,
        filterDate: p6.selectOption,
        fromDate: p6.fdate,
        toDate: p6.tdate,
      };
    case FilterActions.FROM_DATE:
      const p7 = payload as IFilterPayload;
      return {
        ...state,
        filterDate: p7.selectOption,
        fromDate: p7.fdate,
        toDate: null,
      };
    case FilterActions.TO_DATE:
      const p8 = payload as IFilterPayload;
      return {
        ...state,
        filterDate: p8.selectOption,
        fromDate: p8.fdate,
        toDate: p8.tdate,
      };
    case FilterActions.SINGLE_DAY:
      const p9 = payload as IFilterPayload;
      return {
        ...state,
        filterDate: p9.selectOption,
        singleDay: p9.fdate,
        fromDate: null,
        toDate: null,
      };
    case FilterActions.RESET:
      return {
        ...state,
        filterDate: "month",
        singleDay: null,
        fromDate: null,
        toDate: null,
      };

    default:
      return state;
  }
};
