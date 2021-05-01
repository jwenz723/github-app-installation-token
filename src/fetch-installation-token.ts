import { createAppAuth, StrategyOptions } from "@octokit/auth-app";

/**
 * @return {PromiseLike<string>} A token for a GitHub App Installation
 */
export const fetchInstallationToken = async (createAppAuthOptions: StrategyOptions, installationId: string): Promise<string> => {
    const auth = createAppAuth(createAppAuthOptions);

    // For some reason the typing isn't setup properly to allow access of properties so adding `: any` here to cast to
    // the generic any type so that bracket notation can be used to access properties
    const installation: any = await auth({
        installationId: installationId,
        type: "installation",
    });
    return installation.token;
};
