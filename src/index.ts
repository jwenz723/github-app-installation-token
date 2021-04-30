import { getInput, info, setFailed, setOutput, setSecret } from "@actions/core";
import isBase64 from "is-base64";
import { createAppAuth } from "@octokit/auth-app";

/**
 * @return {PromiseLike<string>} A token for a GitHub App Installation
 */
const fetchInstallationToken = async ({
     appId,
     clientId,
     clientSecret,
     installationId,
     privateKey,
 }: Readonly<{
    appId: string;
    clientId: string;
    clientSecret: string;
    installationId: string;
    privateKey: string;
}>): Promise<string> => {
    const auth = createAppAuth({
        appId: appId,
        clientId: clientId,
        clientSecret: clientSecret,
        privateKey: privateKey,
    });
    const installation = await auth({
        installationId: installationId,
        type: "installation",
    });
    return installation.token
};

const run = async () => {
    try {
        const appId = getInput("app_id", { required: true });
        const clientId = getInput("client_id", { required: true });
        const clientSecret = getInput("client_secret", { required: true });
        const installationId = getInput("installation_id", { required: true });
        const privateKeyInput = getInput("private_key", { required: true });
        const privateKey = isBase64(privateKeyInput)
            ? Buffer.from(privateKeyInput, "base64").toString("utf8")
            : privateKeyInput;

        const installationToken = await fetchInstallationToken({
            appId,
            clientId,
            clientSecret,
            installationId,
            privateKey
        })

        setSecret(installationToken);
        setOutput("token", installationToken);
        info("Token generated successfully!");
    } catch (error: unknown) {
        if (typeof error === "string" || error instanceof Error) {
            setFailed(error);
        } else {
            setFailed(`Caught error of unexpected type: ${typeof error}`);
        }
    }
};

void run();
