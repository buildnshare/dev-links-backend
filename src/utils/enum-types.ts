export enum ErrorMessage {
    GROUP_EXISTS = "Group already exists",
    GROUP_NOT_FOUND = "Group doesn't exists",
    LINK_EXISTS = "Link already exists",
    LINK_NOT_FOUND = "Link doesn't exists",
    LABEL_EXISTS = "Label already exists",
    LABEL_NOT_FOUND = "Label not found",
    REDIS_CLIENT_ERROR = "Unable to connect to redis client",
    INTERNAL_SERVER_ERROR = "Server is down, please try again after some time",
}

export enum SuccessMessage {
    GROUP_ADDED = "Successfully added group",
    GROUP_REMOVED = "Successfully removed group",
    LABEL_RENAMED = "Successfully renamed label",
    LINK_ADDED = "Successfully added link",
    LINK_REMOVED = "Successfully removed link", 
    LINK_UPDATED = "Successfully updated link"
}

export type Link = {
    label: string;
    link: string;
};
