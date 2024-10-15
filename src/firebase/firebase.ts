import { Blocks } from "../charSheet";
import { backendUrl } from "./backendSecure";

// Signs the user in and returns their email.
export const login = async (email: string, password: string): Promise<string> => {
  try {
    const response = await fetch(`${backendUrl}/login-user?email=${email}&password=${password}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    });
    if (!response.ok) {
      throw new Error(response.status.toString());
    }
    const data = await response.json();
    return data.email;
  } catch (error) {
    return Promise.reject(error);
  }
}

// Registers a new user and returns their email.
export const register = async (email: string, password: string): Promise<string> => {
  try {
    const response = await fetch(`${backendUrl}/register-user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });
    if (!response.ok) {
      throw new Error(response.status.toString());
    }
    const data = await response.json();
    return data.email;
  } catch (error) {
    return Promise.reject(error);
  }
}

// Loads an existing document.
export const loadState = async (sheetId: number): Promise<Blocks> => {
  try {
    const response = await fetch(`${backendUrl}/get-character?sheetId=${sheetId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    });
    if (!response.ok) {
      throw new Error("Failed to load state");
    }
    const data = await response.json();
    return data.result as Blocks;
  } catch (error) {
    return Promise.reject(error);
  }
};

// Updates an existing document with the new data.
// returns true if successful, false otherwise
export const saveState = async (state: Blocks, sheetId: number, owner: string): Promise<boolean> => {
  try {
    // updating sql database is troublesome, so I will just delete the old one and create a new one
    await fetch(`${backendUrl}/delete-character?sheetId=${sheetId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ sheetId })
    });
    await fetch(`${backendUrl}/store-new-character`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ state, owner, sheetId })
    });
    return true;
  } catch (error) {
    console.error("Failed to save state with error: " + error);
    return false;
  }
};

// Saves data to the database
// Returns the id of the core table entry
export const saveNew = async (state: Blocks, owner: string): Promise<number> => {
  try {
    const response = await fetch(`${backendUrl}/store-new-character`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ state, owner })
    });
    if (!response.ok) {
      throw new Error("Failed to save new document");
    }
    const data = await response.json();
    return data.result as number;
  } catch (error) {
    return Promise.reject(error);
  }
}

// Returns a list of docs belonging to the provided user.
export async function getDocList(owner: string): Promise<{ id: number, create_time: string, name: string }[]> {
  try {
    // response.results has form [{id: number, create_time: string, name: string}, ...]
    const response = await fetch(`${backendUrl}/get-character-list?owner=${owner}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
    if (!response.ok) {
      throw new Error("Failed to get document list");
    }
    const data = await response.json();
    return data.results;
  } catch (error) {
    throw error;
  }
}

// Deletes the given document
export async function deleteCharacter(sheetId: number) {
  try {
    const response = await fetch(`${backendUrl}/delete-character`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ sheetId })
    });
    if (!response.ok) {
      throw new Error("Failed to delete character");
    }
    console.log("Successfully deleted character");
  } catch (error) {
    console.error("Failed to delete character with error: " + error);
  }
}