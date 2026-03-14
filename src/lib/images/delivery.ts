import { isCloudflareWorkersRuntime } from "@/lib/cloudflare/runtime";

type CloudflareRequestInit = RequestInit & {
    cf?: {
        image?: {
            width: number;
            fit: "scale-down";
            metadata: "none";
        };
    };
};

const IMAGE_WIDTHS = {
    small: 400,
    medium: 800,
} as const;

export function getRequestedWidth(size: string): number | null {
    if (size === "small" || size === "medium") {
        return IMAGE_WIDTHS[size];
    }

    return null;
}

export async function fetchTelegramImage(fileLink: string, size: string, acceptHeader: string | null): Promise<Response> {
    const width = getRequestedWidth(size);
    const headers = new Headers();

    if (acceptHeader) {
        headers.set("Accept", acceptHeader);
    }

    if (width && isCloudflareWorkersRuntime()) {
        return fetch(fileLink, {
            headers,
            cf: {
                image: {
                    width,
                    fit: "scale-down",
                    metadata: "none",
                },
            },
        } as CloudflareRequestInit);
    }

    return fetch(fileLink, { headers });
}