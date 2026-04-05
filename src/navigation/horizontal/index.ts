import apps from './apps'
import charts from './charts'
import dashboard from './dashboard'
import forms from './forms'
import manager from './manager'
import misc from './misc'
import pages from './pages'
import tables from './tables'
import uiElements from './ui-elements'
import type { HorizontalNavItems } from '@layouts/types'

export default [...dashboard, ...manager, ...apps, ...pages, ...uiElements, ...forms, ...tables, ...charts, ...misc] as HorizontalNavItems
