export enum WorkTag {
  FunctionComponent = 0,

  /** @description ReactDOM.createRoot(container) 中的 container */
  HostRoot = 3,

  /** @description 比如 <div></div> */
  HostComponent = 5,

  HostText = 6,
}
