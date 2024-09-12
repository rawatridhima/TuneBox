import bcrypt from "bcryptjs";

export const validateForm = (...formInputs) => {
  let isValid = true;
  formInputs.forEach((x) => {
    let flag = true;
    if (x == -1 || x == " " || x === null || x === undefined) flag = false;
    isValid &&= flag;
  });
  return isValid;
};
export const encryptData = (word) => {
  return bcrypt.hashSync(word, 5);
};

export const compareEncryptedData = (userData, HashData) => {
  return bcrypt.compareSync(userData, HashData);
};

export const convertNum=(n)=>{
  if(n<=9) return "0"+n;
  else return n;
}
export const convertTime=(n)=>{
 const seconds = Math.floor ((n/ 1000) % 60 );
 const  minutes = Math.floor(((n / (1000*60)) % 60));
 return `${minutes} : ${seconds}`
}
 export const   formatTime = (time) => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;
  return `${minutes}:${formattedSeconds}`;
};