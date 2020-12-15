export const isInGroup = (authData, group) => {
    if (authData) {
        const { payload } = authData.signInUserSession.idToken;
        return (
            payload["cognito:groups"] && payload["cognito:groups"].includes(group)
        );
    }
    return false;
};