// Placeholder for cluster helper functions
export const formatClusterData = (cluster: any) => {
    return {
        id: cluster._id,
        ...cluster._doc
    };
};
