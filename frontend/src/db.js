import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";

async function addUser() {
  try {
    await addDoc(collection(db, "users"), {
      name: "Mukesh",
      email: "mukesh@example.com",
      createdAt: new Date()
    });
    console.log("User added successfully!");
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

addUser();
