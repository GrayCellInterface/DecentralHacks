import React from 'react';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import * as IoIcons from 'react-icons/io';

export const SidebarData = [
    {
        title: 'Profile',
        path: '/profile',
        icon: <AiIcons.AiFillHome />,
        cName: 'nav-text',
        hasChildren: false
    },
    {
        title: 'Products',
        path: '/products',
        icon: <FaIcons.FaBoxOpen />,
        cName: 'nav-text',
        hasChildren: false
    },
    {
        title: 'Add Product',
        path: '/add-product',
        icon: <FaIcons.FaCartPlus />,
        cName: 'nav-text',
        hasChildren: false
    },
    {
        title: 'Orders',
        path: '/completed',
        icon: <IoIcons.IoIosPaper />,
        cName: 'nav-text',
        hasChildren: true,
    }
];