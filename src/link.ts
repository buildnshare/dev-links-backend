import { client } from "./client";
import { ErrorMessage, SuccessMessage, type Link } from "./utils";

export const checkGroupExists = async (group: string) => {
    try {
        const groupExists = await client.hExists("groupHash", group);
        return groupExists === 0 ? false : true;
    } catch (err) {
        console.error(err);
        return { error: err instanceof Error ? err.message : 'unexpected error' };
    }
}

export const checkLinkExists = async (label: string, group: string) => {
    try {
        const links = await client.hGet('groupHash', group);
        if (links === null) return { error: ErrorMessage.GROUP_NOT_FOUND }

        let filterLength = JSON.parse(links).filter((item: Link) => item.label === label).length;

        return filterLength === 0 ? false : true;
    } catch (err) {
        console.error(err);
        return { error: err instanceof Error ? err.message : 'unexpected error' };
    }
}

export const addGroup = async (groupName: string) => {
    try {
        const groupExists = await checkGroupExists(groupName);
        if (groupExists) return { error: ErrorMessage.GROUP_EXISTS };

        const response = await client.hSet("groupHash", groupName, JSON.stringify([]));
        return response === 1 ? { success: SuccessMessage.GROUP_ADDED } : { error: ErrorMessage.GROUP_EXISTS }

    } catch (err) {
        console.error(err);
        return { error: err instanceof Error ? err.message : "unexpected error" };
    }
};

export const removeGroup = async (groupName: string) => {
    try {
        const response = await client.hDel("groupHash", groupName);
        return response === 0 ? { error: ErrorMessage.GROUP_NOT_FOUND } : { success: SuccessMessage.GROUP_REMOVED };
    } catch (err) {
        console.error(err);
        return { error: err instanceof Error ? err.message : "unexpected error" };
    }
};

export const addLinkToGroup = async (groupName: string, link: Link) => {
    try {
        const linkExists = await checkLinkExists(link.label, groupName);
        if (linkExists) return { error: ErrorMessage.LINK_EXISTS };

        const groups = await client.hGet("groupHash", groupName);
        const parsedGroups = JSON.parse(groups!);


        let pushedLinks = [...parsedGroups, link]

        await client.hSet("groupHash", groupName, JSON.stringify(pushedLinks));
        return { 
            success: SuccessMessage.LINK_ADDED 
        } 
        
    } catch (err) {
        console.error(err);
        return { error: err instanceof Error ? err.message : "unexpected error" };
    }
};

export const removeLinkFromGroup = async (groupName: string, label: string) => {
    try {
        const linkExists = await checkLinkExists(label, groupName);
        if (!linkExists) return { error: ErrorMessage.LINK_NOT_FOUND }

        const group = await client.hGet("groupHash", groupName);
        if (!group) return { error: ErrorMessage.GROUP_NOT_FOUND };

        const parsedGroup = JSON.parse(group);

        let updateLinks = JSON.stringify(parsedGroup.filter((item: Link) => item.label != label))
        await client.hSet("groupHash", groupName, updateLinks);
        return  { success: SuccessMessage.LINK_REMOVED } ;
    } catch (err) {
        console.error(err);
        return { error: err instanceof Error ? err.message : "unexpected error" };
    }
};

export const showGroups = async () => {
    try {
        const groups = await client.hGetAll("groupHash");
        return { data: Object.keys(groups) }
    } catch (err) {
        console.error(err);
        return { error: err instanceof Error ? err.message : "unexpected error"};
    }
};

export const showLinksInGroup = async (groupName: string) => {
    try {
        const groupHash = await client.hGetAll("groupHash");
        const groups = Object.entries(groupHash);

        const searchResult = groups.filter((item) => item[0] === groupName)
        if (searchResult.length === 0) return { error: ErrorMessage.GROUP_NOT_FOUND }

        const groupLinkData = searchResult.map((item) => {
            return {
                groupName: item[0],
                ...JSON.parse(item[1])
            }
        });
        return { data: groupLinkData };
    } catch (err) {
        console.error(err);
        return { error: err instanceof Error ? err.message : "unexpected error" };
    }
};

export const showLinksByLabelOrGroup = async (label: string, groupName?: string) => {
    try {
        const groupHash = await client.hGetAll("groupHash");
        let groups = Object.entries(groupHash);
        let searchResult = []

        if (groupName) { 
            groups = groups.filter((item) => item[0] === groupName) 
            if (groups.length == 0) return { error: ErrorMessage.GROUP_NOT_FOUND }
        };

        searchResult = groups.map((item) => {
            const links = JSON.parse(item[1]);
            return {
                groupName: item[0],
                result: links.filter((item: Link) => item.label === label)
            }
        }).filter(item => item.result.length > 0);

        return searchResult.length > 0 ? { data: searchResult } : { error: ErrorMessage.LABEL_NOT_FOUND } 
    } catch (err) {
        console.error(err);
        return { error: err instanceof Error ? err.message : "unexpected error" };
    }
};