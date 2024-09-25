var config = {};

config.CURRENTLY_DEFINED_ROLES = 
    {
      ACTION_ROLES :
     [
       
        "CREATE_USER", // Ability to Create new Users
        "EDIT_USER",  // Ability to edit other user's data
        "DELETE_USER", // ability to delete user
        "ADD_NEW_ROLE",// ability to add custom roles
        "EDIT_ROLE",
        "DELETE_ROLE",
        "CREATE_FIR",
        "EDIT_FIR",
     ],
        READ_ROLES :
      [
            "READ_ALL_USERS", // Read Roles and Names of all users
            "READ_FULL_USER", // Address, Phone number and all other details of other users
            "READ_ALL_ROLES",
            "READ_FULL_ROLE",
            "CRIME_TYPE",
            "DATE_OF_CRIME",
            "CRIME_USED_WEAPONS",
            "CRIME_EVIDENCE",
            "CRIME_SUSPECT",
            "CRIME_VICTIM",
            "CRIME_DETAILS",
            "ACCUSED_VICTIM_RELATION"

      ]
     
    }
  

config.DEFAULT_ADMIN_PASS = "@Adm!n!S4B0V3_a113ls3"
config.DEFAULT_ADMIN_NAME = "def_admin"
config.DEFAULT_ADMIN_ADDRESS = "Dummy Address"
config.DEFAULT_ADMIN_PHONE = "0000000000"
config.DEFAULT_ADMIN_EMAIL = "admin@vmapcrimes.com"
config.PUBLICLY_ACCESSIBLE_PAGES = ["/api/auth/login","/api/fetch/fetchFIR","/api/data/fetchFirCount"]
module.exports = config;
    