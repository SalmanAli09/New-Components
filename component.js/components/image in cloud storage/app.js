import { initializeApp } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-analytics.js";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-storage.js";
import { doc, setDoc, getDoc, getFirestore } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js";



const firebaseConfig = {
    apiKey: "AIzaSyAYWkbFdxnwEMZsj-mIjuZTK9cgDqeZouc",
    authDomain: "blog-app-bb020.firebaseapp.com",
    projectId: "blog-app-bb020",
    storageBucket: "blog-app-bb020.appspot.com",
    messagingSenderId: "332224635432",
    appId: "1:332224635432:web:23ed5a03a99f1f03578b1d",
    measurementId: "G-5BHHJSYMZG"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const storage = getStorage();
const db = getFirestore()

const getFile = document.getElementById("getFile");
const btn = document.getElementById("filebtn");

btn.addEventListener('click', () => {
    const imageHere = imageToURL(getFile.files[0])
})


const imageToURL = (file) => {
    return new Promise((resolve, reject) => {
        const storageRef = ref(storage, 'images/profiles.png');
        const uploadTask = uploadBytesResumable(storageRef, file);
        uploadTask.on('state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
                switch (snapshot.state) {
                    case 'paused':
                        console.log('Upload is paused');
                        break;
                    case 'running':
                        console.log('Upload is running');
                        break;
                }
            },
            (error) => {
                reject(error)
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
                    console.log('File available at', downloadURL);
                    resolve(downloadURL)
                    // Add a new document in collection "cities"
                    await setDoc(doc(db, "users", "picture"), {
                        photo: downloadURL
                    });

                });
            }
        );
    })
}

let img = document.getElementById("img");

const docRef = doc(db, "users", "picture");
const docSnap = await getDoc(docRef);
if (docSnap.exists()) {
  console.log("Document data:", docSnap.data().photo);
  img.src = docSnap.data().photo
} else {
  console.log("No such document!");
}

















