

export interface NonTaskDataReadResult {
    allLocatons: LocationClientCollection;
    persistedProperties: PersistedProperties;
    refreshHistory: RefreshHistory;
    scriptExtensions: DashboardScriptExtensionInfoClientCollection;
    userSettings: UserSettings; 
}
export interface LocationClientCollection {
 	 color: string;
	 id: number;
	 important: boolean;
	 name: string;
	 parentId: number;
	 rootProviderKey: string;
	 url: string; 
}
export interface PersistedProperties {
 	 filteredLocationIds: number[];
	 groupByProjects: boolean;
	 hasShownMarkAsImportantCallout: boolean;
	 hasShownTaskListTooLongNotification: boolean;
	 quickLaunchLandingPage: string; 
}
export interface RefreshHistory {
 	 refreshes: RefreshEventInfoClientCollection; 
}
export interface RefreshEventInfoClientCollection {
 	 aggregatorRefreshState: number;
	 correlationId: string;
	 providerStatuses: ProviderRefreshStatusClientCollection;
	 refreshFinished: number;
	 refreshId: number;
	 taskChangesByLocation: LocationUpdateResultClientCollection; 
}
export interface ProviderRefreshStatusClientCollection {
 	 providerKey: string;
	 providerLocalizedName: string;
	 refreshFinished: number;
	 refreshStarted: number;
	 rootLocationId: number; 
}
export interface LocationUpdateResultClientCollection {
 	 activeAddedCount: number;
	 addedCount: number;
	 removedCount: number;
	 rootLocationId: number;
	 updatedCount: number; 
}
export interface DashboardScriptExtensionInfoClientCollection {
 	 providerKey: string;
	 scriptClass: string;
	 scriptData: string;
	 scriptFiles: number[]; 
}
export interface UserSettings {
 	 daysAfterCurrentDateTimelineEnds: number;
	 daysATaskIsConsideredNewTask: number;
	 daysBeforeCurrentDateTimelineStarts: number;
	 importantLocationIds: number[];
	 importantTasksLimit: number;
	 inactiveMonthsBeforeLocationExpiration: number;
	 lateTasksLimit: number;
	 oldTasksLimit: number;
	 upcomingTasksLimit: number; 
}


