import * as React from "react";
import { useCallback } from "react";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { ThemeProvider, createTheme, CssBaseline, Divider } from '@mui/material';

interface MenuItemBase {
	id: string;
	label: string;
	isDivider?: false;
}

interface MenuDivider {
	id?: never;
	label?: never;
	isDivider: true;
}

export type MenuItem = MenuItemBase | MenuDivider;

export interface ItemClickEvent {
	itemId: string;
}

export type ItemClickEventHandler = (event:ItemClickEvent) => void;

interface Props {
	menuItems: MenuItem[];
	onItemClick: ItemClickEventHandler;
}

let computedStyle_:CSSStyleDeclaration|null = null;
const getCssVariable = (variableName: string) => {
	if (!computedStyle_) computedStyle_ = getComputedStyle(document.documentElement);
	return computedStyle_.getPropertyValue(variableName).trim();
}

const theme = createTheme({
	palette: {
		background: {
			default: getCssVariable('--joplin-background-color'),
		},
		primary: {
			main: getCssVariable('--joplin-color'), 
		},
		text: {
			primary: getCssVariable('--joplin-color'), 
		},
		divider: getCssVariable('--joplin-divider-color') ,
	},

	components: {
		MuiMenuItem: {
			styleOverrides: {
				root: {
					color: getCssVariable('--joplin-color'),
					'&:hover': {
						backgroundColor: getCssVariable('--joplin-selected-color'),
						color: getCssVariable('--joplin-color'),
					},
				},
			},
		},
		MuiPopover: {
			styleOverrides: {
				paper: {
					backgroundColor: getCssVariable('--joplin-background-color'),
				},
			},
		},
	  },
});  

export default (props:Props) => {
	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);
	
	const onClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const onClose = () => {
		setAnchorEl(null);
	}

	const onMenuItemClick = useCallback<React.MouseEventHandler>((event) => {
		onClose();
		const itemId = event.currentTarget.getAttribute('data-id');
		props.onItemClick({ itemId });
	}, [onClose, props.onItemClick]);

	const renderMenuItems = () => {
		const output:React.JSX.Element[] = [];
		for (const menuItem of props.menuItems) {
			if (menuItem.isDivider) {
				output.push(<Divider/>);
			} else {
				output.push(<MenuItem data-id={menuItem.id} key={menuItem.id} onClick={onMenuItemClick}>{menuItem.label}</MenuItem>);
			}
		}
		return output;
	}

	return (
		<ThemeProvider theme={theme}>
			<button onClick={onClick} className="kebab-button">
				<i className="fas fa-ellipsis-v"></i>
			</button>
			<Menu
				className="context-menu"
				anchorEl={anchorEl}
				open={open}
				onClose={onClose}
				MenuListProps={{
					'aria-labelledby': 'basic-button',
				}}
			>
				{renderMenuItems()}
			</Menu>
		</ThemeProvider>
	);
}