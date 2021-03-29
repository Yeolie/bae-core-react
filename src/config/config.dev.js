export const domainGateway = "https://dev-online-gateway.ghn.vn"

export const appKey = "6a9f1871-b9c5-4461-ae30-047f693d26f1"

export const domainLogin = "https://sso-v2.ghn.dev/internal/login"
export const domainLogout = "https://sso-v2.ghn.dev/internal/logout"

export const systemId = "36"

export const api = {
    userInfo: {
        url: domainGateway + "/notification/public-api/user-info",
    },
    genAccessToken: {
        url: domainGateway + "/notification/public-api/gen-access-token",
    },
    getPermission: {
        url: domainGateway + "/notification/public-api/permissions-info",
    },

    getEmployeeName: {
        url: domainGateway + "/notification/public-api/get-employee-name",
    },

    // log out
    logOut: {
        url: domainGateway + "/notification/public-api/internal/logout",
    },

    // segment
    getAllSegment: {
        url: domainGateway + "/notification/public-api/segments/all",
    },
    createSegment: {
        url: domainGateway + "/notification/public-api/segments/create",
    },
    updateSegment: {
        url: domainGateway + "/notification/public-api/segments/update-info",
    },
    updateStatusSegment: {
        url: domainGateway + "/notification/public-api/segments/update-status",
    },
    deleteSegment: {
        url: domainGateway + "/notification/public-api/segments/delete",
    },
    detailSegment: {
        url: domainGateway + "/notification/public-api/segments/detail",
    },

    //Files
    getAllFiles: {
        url: domainGateway + "/notification/public-api/files/all",
    },
    uploadFiles: {
        url: domainGateway + "/notification/public-api/files/upload",
    },
    getFileDetail: {
        url: domainGateway + "/notification/public-api/files/info",
    },
    deleteFile: {
        url: domainGateway + "/notification/public-api/files/delete",
    },

    //Campaign
    getAllCampaign: {
        url: domainGateway + "/notification/public-api/campaigns/all",
    },
    getCampaignDetail: {
        url: domainGateway + "/notification/public-api/campaigns/detail",
    },
    createCampaign: {
        url: domainGateway + "/notification/public-api/campaigns/create",
    },
    updateCampaign: {
        url: domainGateway + "/notification/public-api/campaigns/update-info",
    },
    approveCampaign: {
        url: domainGateway + "/notification/public-api/campaigns/approve",
    },
    deleteCampaign: {
        url: domainGateway + "/notification/public-api/campaigns/delete",
    },
    enableCampaign: {
        url: domainGateway + "/notification/public-api/campaigns/enable",
    },
    campaignReport: {
        url: domainGateway + "/notification/public-api/campaigns/get-notify-result",
    },
    rejectCampaign: {
        url: domainGateway + "/notification/public-api/campaigns/reject",
    },
    testByClientId: {
        url: domainGateway + "/notification/public-api/campaigns/test-by-clientids",
    },
    stopCampaign: {
        url: domainGateway + "/notification/public-api/campaigns/stop",
    },

    // config fee
    getAllConfigFee: {
        url: domainGateway + "/notification/public-api/fee-config/all",
    },
    // province
    getAllProvince: {
        url: domainGateway + "/notification/public-api/master-data/provinces",
    },
    // client
    getClient: {
        url: domainGateway + "/notification/public-api/segments/clients-by-condition",
    },
}
