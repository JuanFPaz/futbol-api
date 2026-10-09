import { PathFileRaw, PathFileView, PathStorage } from "./path.types.js";

export type RequestCreateView = {
  path: PathFileRaw;
  storage: PathStorage;
};

export type RequestUpdateView = {
  path: PathFileView;
  storage: PathStorage;
};
