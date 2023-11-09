import { ReactNode } from 'react';

const Layout = ({ children }: { children: ReactNode }) => {
	return <div className='mx-auto flex flex-grow w-full'>{children}</div>;
};

export default Layout;
