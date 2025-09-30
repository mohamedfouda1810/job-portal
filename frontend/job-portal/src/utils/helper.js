  export const validateEmail = (email) => {
    if (!email.trim()) return 'Email is Required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'Please enter valid Form of Email';
    return '';

};
  

export const validatePassword = (password) => {
  if (!password) return 'password is Required';
  if (password.length < 8) return 'password must at least 8 carachters ';
  if (!/(?=.*[a-z])/.test(password))
    return 'password must contain lowercase letter '
  if (!/(?=.*[A-z])/.test(password))
    return 'password must contain uppercase letter '
  if (!/(?=.*\d)/.test(password))
    return 'password must contain at least one number  ';
  return ""
  
}

export const validateAvatar = (file) => {
  if (!file) return "";// avatar is opional
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
  if (!allowedTypes.includes(file.type)) {
    return 'avatar must be jpg or png file'
  }

  const maxSize = 5 * 1024 * 1024;//5MB
  if (file.size > maxSize) {
    return 'avatar must be less than 5MB '
  }
  return '';
  
}


export const getInitials = (name) => {
  return name
    .split(' ')
    .map((word) => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2)
  
}