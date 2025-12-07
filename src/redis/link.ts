import { isEqual } from "lodash";
import { client } from "./client";

export type Link = {
    label: string;
    link: string;
};

export const addGroup = async (groupName: string) => {
    try {
        const response = await client.hSet(
            "groupHash",
            groupName,
            JSON.stringify([])
        );
        if (!response)
            return {
                status: "failure",
                service: "add-group",
            };

        return {
            status: "success",
            service: "add-group",
        };
    } catch (err) {
        console.error(err);
        return {
            status: "failure",
            service: "add-group",
            error: err instanceof Error ? err.message : "unexpected error",
        };
    }
};

export const removeGroup = async (groupName: string) => {
    try {
        const response = await client.hDel("groupHash", groupName);
        if (response == 0)
            return {
                status: "failure",
                service: "remove-group",
            };

        return {
            status: "success",
            service: "remove-group",
        };
    } catch (err) {
        console.error(err);
        return {
            status: "failure",
            service: "remove-group",
            error: err instanceof Error ? err.message : "unexpected error",
        };
    }
};

export const addLinkToGroup = async (groupName: string, link: Link) => {
    try {
        const groups = await client.hGet("groupHash", groupName);
        const parsedGroups = JSON.parse(groups!);
        
        const existsFilter = parsedGroups.filter((item: Link) => isEqual(item, link))
        if (existsFilter.length > 0) return {
            status: "failure",
            service: "add-link",
            error: 'link already exists',
        }
        const response = await client.hSet(
            "groupHash",
            groupName,
            JSON.stringify([...parsedGroups, link])
        );

        if (response == null)
            return {
                status: "failure",
                service: "add-link",
            };

        return {
            status: "success",
            service: "add-link",
        };
    } catch (err) {
        console.error(err);
        return {
            status: "failure",
            service: "add-link",
            error: err instanceof Error ? err.message : "unexpected error",
        };
    }
};

export const removeLinkFromGroup = async (groupName: string, label: string) => {
    try {
        const groups = await client.hGet("groupHash", groupName);
        const parsedGroups = JSON.parse(groups!);
        if (!parsedGroups)
            return {
                status: "failure",
                service: "remove-links",
                reason: "no group found",
            };

        const response = await client.hSet(
            "groupHash",
            groupName,
            JSON.stringify(parsedGroups.filter((item: Link) => item.label != label))
        );
        if (response == null)
            return {
                status: "failure",
                service: "remove-links",
            };

        return {
            status: "success",
            service: "remove-links",
        };
    } catch (err) {
        console.error(err);
        return {
            status: "failure",
            service: "remove-link",
            error: err instanceof Error ? err.message : "unexpected error",
        };
    }
};

export const showGroups = async () => { 
    try {
        const groups = await client.hGetAll("groupHash");
        const groupNames = Object.keys(groups);
        if (groupNames.length == 0) return {
            status: "empty response",
            servive: "show groups",
            data: [],
        }

        return {
            status: "success",
            service: "show groups",
            response: groupNames
        }

    } catch(err) {
        console.error(err);
        return {
            status: "failure",
            service: "show groups",
            error: err instanceof Error ? err.message : "unexpected error",
        };
    }
  };

export const showLinksInGroup = async (groupName: string) =>{
    try {   
        const groupHash = await client.hGetAll("groupHash");
        const groups = Object.entries(groupHash);
        const searchResult = groups.filter((item) => item[0] === groupName)
        if (searchResult.length === 0) return {
            status: "group not found",
            service: "links",
            operation: "query",
            data: searchResult
        };
        
        const groupLinkData = searchResult.map((item) => {
            return {
                groupName: item[0],
                ...JSON.parse(item[1])
            }
        });
        return {
            status: "sucess", 
            service: "links",
            operation: "query",
            data: groupLinkData
        };
    } catch(err) {
        console.error(err);
        return {
            status: "failure",
            service: "links",
            operation: "query",
            error: err instanceof Error ? err.message : "unexpected error",
        };
    }
 };

export const showLinksByLabelOrGroup = async (label: string, groupName?: string ) => { 
    try {
        const groupHash = await client.hGetAll("groupHash");
        let groups = Object.entries(groupHash);   
        let searchResult = [] 
        if (groupName) groups = groups.filter((item) => item[0] === groupName);
        searchResult = groups.map((item) => {
            const links = JSON.parse(item[1]);
            return {
                groupName: item[0],
                result: links.filter((item: Link) => item.label === label)
            }
        }).filter(item => item.result.length > 0);
        
        if (searchResult.length === 0) return {
            status: "label not found",
            service: "links",
            operation: "query",
            data: searchResult
        };

        return {
            status: "sucess",
            service: "links",
            operation: "query",
            data: searchResult
        }
    } catch(err) {
        console.error(err);
        return {
            status: "failure",
            service: "links",
            operation: "query",
            error: err instanceof Error ? err.message : "unexpected error",
        };
    }
};