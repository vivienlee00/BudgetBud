// TODO(developer): Set to client ID and API key from the Developer Console
const CLIENT_ID = '114560157015657373518';
const API_KEY = 'MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCNQ9BSAQoWiGsK\neXKxl9xxLtW0fAW4vkRgjsKb7cZWaFh/2vFI5o+beqQ10LoDIqkIOkGCkQaVGLWy\ny1E12b9aG7RiM8hXgICgB9/WcnMpb1CxfnsmgenNcBcvWKj1fhTR5+TfCVJML8Ce\nj8FovUsleBu+OGbrENg0vgQaQAWewTgKapdqqKKBhMkSXS5QiabdTymhVXbCCa+M\n6Sf5Pmkhycfz34ec6kRF3lLhXjEEMFMBQwIjEqVyTw5XhCdxGUz5sPhZHpjqFlpJ\nLJmD8vZHv6m7GkDhkIbUAgCJUf17B5RTIETwWisg0ofmqBdd2uFnkkQiQS0vT8KS\nnVchzXuJAgMBAAECggEAB7B7ScYYtc/zKPzMthyyuSPNf3zeFYegfTOy0Ci0inDf\nmwYLQDvx8TVPHvF0+UViYg+ZupuzpLCq+J0slyZ6eKiCvHMJIrTcoNliNnAVvgRQ\ne3jhBzWRyRxNhsboBi+OE+bwLwZ43lYdwVkd3q+pxCkHiZEpuP3lEZSORfIvhsv0\n+/KgY7dhB2yOGPUXCHzcMCILawmL2iiMC9ejoq22lkqKWBL9Uf2WmFEH+3VccJR4\nsPM0EH/omJQJslF+zMVVwmuphy7wbATSIu9nFLXS6CG4Os0JHomp+tkPAn4Gwttg\ngwrgTkbASvbXwl/OKkj6FIFzm1lqLPr1q0K1DepfCQKBgQDAjTTaMrvqEcupKqHr\nf7vcFk0HRxuLr8lRiKg2KFGbjVB8P/c0EpeyVkJUd74ESNGeTVeI2m1A+VpiKzJT\nRTzkMqmGAjJZLq9J2OnTp06DPJvDruYaBDS6oWA7LgonxzmtDOVib+OhLxznbPdo\nseAUiCnk6D0DtcDUn85Dihrw7wKBgQC70EpuKN8IOe5oFdA3XS22tVaPEQHhPLTA\nQVJxuLdSMkUaVYQkTFm0SwN0HY6TjC4/MpybIQkD/TEsH6bbzo9xKtH2qAdOx/3N\nPRp9OvgCF8X1s8wmarjP8MZ5wFfeDx+1um7jLz968T7I0GkGW9veUvqFD0SvvNZ0\nLQ2I83NrBwKBgHTAqj1r6dlh9PWcLhYXm5c1xnsVOLSYYB+aFzTPebwyEY1lU8U1\nSNoPx6Rj/smmRcQQ7XTDzN9K0u0XeCpZnzRXK8df6Zt93TeP2ShHGConQ+OBV3CL\nAFXxp+H6Zpn8CRLO8P+hDIsdgA8rWVEYGeEZNx3fW6+2Mzg5td3qDa/tAoGAH0M7\nsHyTK45hFehToXOcMWacAvKEypZNTBdTfuSNd1wwzoJfnZ8r62v1JjXpTrwt0o09\nLkFge86AieS25K3MiLzk+Fbd6Io3wBsktqXDNK36YLzOBbMMEmj00L1ooukHkTt4\nS87IlVFk7w5p/Qn7XlWXp+BzwYEAfZQmRZ6onq8CgYEAhRlywsqxTqrQLyPai2Xl\nEKtNqfl4rFRzS9of5MyHufuJ1wOf2jy7ouDL1MGLH0TtjzuSCAZX3Nx3NGORQ8FS\n8Hu+cEIvIPJ7XtByiu3/6NC6Kkw14z65HBAxKquxwxhisFI+ia2+fNUEz1vXvn6P\nKU07BibPjSXRNUryZyDB3zo=';

// Discovery doc URL for APIs used by the quickstart
const DISCOVERY_DOC = 'https://sheets.googleapis.com/$discovery/rest?version=v4';

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
const SCOPES = 'https://www.googleapis.com/auth/spreadsheets';

let tokenClient;
let gapiInited = false;
let gisInited = false;

document.getElementById('authorize_button').style.display = 'none';
document.getElementById('signout_button').style.display = 'none';

/**
 * Callback after api.js is loaded.
 */
function gapiLoaded() {
    gapi.load('client', intializeGapiClient);
}

/**
 * Callback after the API client is loaded. Loads the
 * discovery doc to initialize the API.
 */
async function intializeGapiClient() {
    await gapi.client.init({
        apiKey: API_KEY,
        discoveryDocs: [DISCOVERY_DOC],
    });
    gapiInited = true;
    maybeEnableButtons();
}

/**
 * Callback after Google Identity Services are loaded.
 */
function gisLoaded() {
    tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        callback: '', // defined later
    });
    gisInited = true;
    maybeEnableButtons();
}

/**
 * Enables user interaction after all libraries are loaded.
 */
function maybeEnableButtons() {
    if (gapiInited && gisInited) {
        document.getElementById('authorize_button').style.display = 'inline-block';
    }
}

/**
 *  Sign out the user upon button click.
 */
function handleSignoutClick() {
    const token = gapi.client.getToken();
    if (token !== null) {
        google.accounts.oauth2.revoke(token.access_token);
        gapi.client.setToken('');
        document.getElementById('content').innerText = '';
        document.getElementById('authorize_button').innerText = 'Authorize';
        document.getElementById('signout_button').style.display = 'none';
    }
}

/**
 *  Sign in the user upon button click.
 */
function handleAuthClick() {
    tokenClient.callback = async (resp) => {
        if (resp.error !== undefined) {
            throw (resp);
        }
        document.getElementById('signout_button').style.display = 'inline-block';
        document.getElementById('authorize_button').innerText = 'Refresh';
        await listItems();
    };

    if (gapi.client.getToken() === null) {
        // Prompt the user to select a Google Account and ask for consent to share their data
        // when establishing a new session.
        tokenClient.requestAccessToken({ prompt: 'consent' });
    } else {
        // Skip display of account chooser and consent dialog for an existing session.
        tokenClient.requestAccessToken({ prompt: '' });
    }
}

/**
 * Print the names and majors of students in a sample spreadsheet:
 * https://docs.google.com/spreadsheets/d/1Tyygl2QvuIU9gjLumyp16sEqDy9ArBr0uUsAzSg0HN8/edit
 */
async function listItems() {
    let response;
    try {
        // Fetch first 10 files
        response = await gapi.client.sheets.spreadsheets.values.get({
            spreadsheetId: '1Tyygl2QvuIU9gjLumyp16sEqDy9ArBr0uUsAzSg0HN8',
            range: 'Class Data!A2:E',
        });
    } catch (err) {
        document.getElementById('content').innerText = err.message;
        return;
    }
    const range = response.result;
    if (!range || !range.values || range.values.length == 0) {
        document.getElementById('content').innerText = 'No values found.';
        return;
    }
    // Flatten to string to display
    const output = range.values.reduce(
        (str, row) => `${str}${row[0]}, ${row[4]}\n`,
        'Item, Price:\n');
    document.getElementById('content').innerText = output;
}


function submitProfile() {
    let nameField = '@' + document.getElementById('nickname').value;
}