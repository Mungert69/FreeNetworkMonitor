import PingIcon from '@mui/icons-material/Speed';
import HttpIcon from '@mui/icons-material/Http';
import HttpsIcon from '@mui/icons-material/Https';
import HtmlIcon from '@mui/icons-material/Html';
import LanguageIcon from '@mui/icons-material/Language';
import LinkIcon from '@mui/icons-material/Link';
import DnsIcon from '@mui/icons-material/Dns';
import EmailIcon from '@mui/icons-material/Email';
import QuantumIcon from '@mui/icons-material/Flare';
import NmapIcon from '@mui/icons-material/Search';
import NmapVulnIcon from '@mui/icons-material/BugReport';
import CrawlSiteIcon from '@mui/icons-material/Public';
import HugIcon from '@mui/icons-material/AccessAlarm';

// Shared map so both dashboards resolve endpoint icons consistently.
export const endpointIconComponentMap = {
  PingIcon,
  HttpIcon,
  HttpsIcon,
  HtmlIcon,
  LanguageIcon,
  LinkIcon,
  DnsIcon,
  EmailIcon,
  QuantumIcon,
  NmapIcon,
  NmapVulnIcon,
  CrawlSiteIcon,
  HugIcon,
};

export const getEndpointIcon = (iconName) => endpointIconComponentMap[iconName] ?? null;
