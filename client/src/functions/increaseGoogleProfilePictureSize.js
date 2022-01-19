//Function to increase google profile picture quality

export function increaseGoogleProfilePictureSize(profilePictureUrl) {
  //max size 6500 causes error sometimes
  const size = 2000;
  profilePictureUrl = profilePictureUrl.split("=s");
  profilePictureUrl = profilePictureUrl[0] + "=s" + size + "-c";
  return profilePictureUrl;
}
