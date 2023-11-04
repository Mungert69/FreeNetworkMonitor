import React,{useEffect} from 'react';
import Box from '@mui/material/Box';
import Zoom from '@mui/material/Zoom';
import Tooltip from '@mui/material/Tooltip';
import ProfileDialog from './ProfileDialog';

export  function MiniProfile({apiUser,siteId, initViewSub, setInitViewSub, getUserInfo}) {
      const [openProfile, setOpenProfile] = React.useState(false);
      const updateUserInfo  = async () =>{
          await setOpenProfile(true);
          await getUserInfo();
          console.log(" Current User is "+JSON.stringify(apiUser));
      }
      useEffect(() => {
          if (initViewSub) {
               setOpenProfile(true);
             }
        }, []);
     if (apiUser!==undefined ) {
          return (
               <div>
                    {openProfile ? <ProfileDialog apiUser={apiUser} siteId={siteId} setOpen={setOpenProfile} initViewSub={initViewSub} setInitViewSub={setInitViewSub}/> : null}
                    <Tooltip title="View Profile Info" TransitionComponent={Zoom}>
                         <Box
                              component="img"
                              sx={{
                                   height: 35,
                                   width: 35,
                                   borderRadius: "50%",  // Add this
                              }}
                              src={decodeURIComponent(apiUser.picture)}
                              alt="Profile"
                              onClick={() => updateUserInfo()}
                         />
                    </Tooltip>
               </div>
          );
     }
     else { return ; }
}
export default React.memo(MiniProfile);