import React,{useEffect} from 'react';
import Box from '@mui/material/Box';
import Zoom from '@mui/material/Zoom';
import Tooltip from '@mui/material/Tooltip';
import ProfileDialog from './ProfileDialog';
import { useAuth0 } from "@auth0/auth0-react";
import { Style } from '@mui/icons-material';

export default function MiniProfile({apiUser,token,siteId, initViewSub, setInitViewSub}) {
      const [openProfile, setOpenProfile] = React.useState(false);
      useEffect(() => {
          if (initViewSub) {
               setOpenProfile(true);
             }
         
        }, []);

     if (apiUser!==undefined ) {
          return (
               <div>
                    {openProfile ? <ProfileDialog apiUser={apiUser} token={token} siteId={siteId} setOpen={setOpenProfile} initViewSub={initViewSub} setInitViewSub={setInitViewSub}/> : null}
                    <Tooltip title="View Profile Info" TransitionComponent={Zoom}>
                         <Box
                              component="img"
                              sx={{
                                   height: 35,
                                   width: 35,
                              }}
                              src={apiUser.picture}
                              alt="Profile Picture"
                              className="rounded-circle"
                              onClick={() => setOpenProfile(true)}
                         />
                    </Tooltip>
               </div>

          );
     }
     else { return ; }

}


