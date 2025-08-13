import dotenv from 'dotenv';
dotenv.config();

const API_HOST = 'twitter241.p.rapidapi.com';
const API_KEY = process.env.RAPIDAPI_KEY || '';

if (!API_KEY) {
    console.error("Error: RAPIDAPI_KEY is missing. Please set it in the environment variables.");
    process.exit(1); 
}

async function fetchFromTwitter(endpoint: string, params: Record<string, string>): Promise<any> {
    try {
        const url = new URL(`https://${API_HOST}/${endpoint}`);
        Object.entries(params).forEach(([key, value]) => url.searchParams.append(key, value));

        const options: RequestInit = {
            method: 'GET',
            headers: {
                'x-rapidapi-host': API_HOST,
                'x-rapidapi-key': API_KEY
            }
        };

        const response: Response = await fetch(url.toString(), options);

        // Check if response is okay
        if (!response.ok) {
            console.error(`Error: HTTP ${response.status} - ${response.statusText}`);
            return { error: `HTTP ${response.status}: ${response.statusText}` };
        }

        // Parse response JSON safely
        let data: any;
        try {
            data = await response.json();
        } catch (jsonError) {
            console.error("Error: Failed to parse JSON response", jsonError);
            return { error: "Invalid JSON response" };
        }

        console.log("API Response:", JSON.stringify(data, null, 2)); // Log for debugging

        let postData: any = {};

        // Handle tweet & retweets
        if (endpoint === "tweet" || endpoint === "retweets") {
            const tweet = data?.tweet || {};
            postData = {
                id: tweet.id_str || params.pid || "N/A",
                likes: tweet.favorite_count ? Number(tweet.favorite_count) : 0,
                retweets: tweet.retweet_count ? Number(tweet.retweet_count) : 0,
                comments: tweet.reply_count ? Number(tweet.reply_count) : 0,
                shares: tweet.quote_count ? Number(tweet.quote_count) : 0,
                views: data?.views ? Number(data.views) : 0,
                bookmark_count: tweet.bookmark_count ? Number(tweet.bookmark_count) : 0
            };
        } 
        // Handle user details
        else if (endpoint === "user") {
            const userData = data?.result?.data?.user?.result?.legacy || {};
            postData = {
                username: userData.screen_name || params.username || "unknown_user",
                followers: userData.followers_count ? Number(userData.followers_count) : 0,
                userId: data?.result?.data?.user?.result?.id || "unknown_id"
            };
        } 
        // Handle invalid endpoint
        else {
            console.error(`Error: Invalid endpoint "${endpoint}"`);
            return { error: `Invalid endpoint: ${endpoint}` };
        }

        return postData;
    } catch (error) {
        console.error(`Unexpected error fetching data from ${endpoint}:`, error);
        return { error: `Failed to fetch data from ${endpoint}` };
    }
}

// Fetch retweets
export async function getRetweets(pid: string, count: number): Promise<any> {
    if (!pid || isNaN(Number(count))) {
        console.error("Error: Invalid parameters for getRetweets.");
        return { error: "Invalid tweet ID or count" };
    }
    return fetchFromTwitter('retweets', { pid, count: count.toString() });
}

// Fetch user details
export async function getUserByUsername(username: string): Promise<any> {
    if (!username) {
        console.error("Error: Username is required.");
        return { error: "Username is required" };
    }
    return fetchFromTwitter('user', { username });
}

// Fetch tweet details
export async function getTweetById(pid: string): Promise<any> {
    if (!pid) {
        console.error("Error: Tweet ID is required.");
        return { error: "Tweet ID is required" };
    }
    return fetchFromTwitter('tweet', { pid });
}
