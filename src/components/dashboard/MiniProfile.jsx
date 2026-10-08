import React,{useEffect} from 'react';
import Box from '@mui/material/Box';
import Zoom from '@mui/material/Zoom';
import Tooltip from '@mui/material/Tooltip';
import ProfileDialog from './ProfileDialog';

export  function MiniProfile({apiUser,siteId, initViewSub, setInitViewSub, getUserInfo}) {
      const [openProfile, setOpenProfile] = React.useState(false);
      const updateUserInfo  = async () =>{
          await setOpenProfile(true);

      }
      
      useEffect(() => {
          if (initViewSub) {
               setOpenProfile(true);
             }
        }, [initViewSub]);
     if (apiUser!==undefined ) {
          return (
               <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 40, height: 40, flexShrink: 0 }}>
                    {openProfile ? <ProfileDialog apiUser={apiUser} siteId={siteId} setOpen={setOpenProfile} initViewSub={initViewSub} setInitViewSub={setInitViewSub} getUserInfo={ getUserInfo} /> : null}
                    <Tooltip title="View Profile Info" TransitionComponent={Zoom}>
                         <Box
                              component="img"
                              sx={{
                                   height: 32,
                                   width: 32,
                                   display: 'block',
                                   cursor: 'pointer',
                                   borderRadius: "50%",  // Add this
                              }}
                              src={decodeURIComponent(apiUser.picture)}
                              alt="Profile"
                              onClick={() => updateUserInfo()}
                         />
                    </Tooltip>
               </Box>
          );
     }
     else { return ; }
}
export default React.memo(MiniProfile);
