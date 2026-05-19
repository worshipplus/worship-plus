import { createContext, useContext, type ReactNode } from "react";
import type { UserSource } from "../adapters/contracts/UserSource";
import type { SetlistSource } from "../adapters/contracts/SetlistSource";
import type { EventSource } from "../adapters/contracts/EventSource";
import { MockUserSource } from "../adapters/implementations/MockUserSource";
import { MockSetlistSource } from "../adapters/implementations/MockSetlistSource";
import { MockEventSource } from "../adapters/implementations/MockEventSource";

export interface DataSources {
  userSource: UserSource;
  setlistSource: SetlistSource;
  eventSource: EventSource;
}

const defaultSources: DataSources = {
  userSource: new MockUserSource(),
  setlistSource: new MockSetlistSource(),
  eventSource: new MockEventSource(),
};

const DataSourcesContext = createContext<DataSources>(defaultSources);

export function DataSourcesProvider({
  children,
  sources = defaultSources,
}: {
  children: ReactNode;
  sources?: DataSources;
}) {
  return (
    <DataSourcesContext.Provider value={sources}>
      {children}
    </DataSourcesContext.Provider>
  );
}

export function useDataSources(): DataSources {
  return useContext(DataSourcesContext);
}
