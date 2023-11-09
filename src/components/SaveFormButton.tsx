import React, { useTransition } from 'react';
import { Button } from './ui/button';
import { HiSaveAs } from 'react-icons/hi';
import useDesigner from './hooks/useDesigner';
import { UpdateFormContent } from '@/actions/form';
import { useToast } from './ui/use-toast';
import { FaSpinner } from 'react-icons/fa';

const SaveFormButton = ({ id }: { id: number }) => {
	const { elements } = useDesigner();
	const { toast } = useToast();
	const [loading, startTransition] = useTransition();

	const updateFormContent = async () => {
		try {
			await UpdateFormContent(id, elements);
			toast({
				title: 'Success',
				description: 'Your form has been saved',
			});
		} catch (error) {
			toast({
				title: 'Error',
				description: 'Something went wrong',
				variant: 'destructive',
			});
		}
	};

	return (
		<Button
			variant='outline'
			className='gap-2'
			disabled={loading}
			onClick={() => startTransition(updateFormContent)}
		>
			<HiSaveAs className='h-4 w-4' />
			Save {loading ? <FaSpinner className='animate-spin' /> : null}
		</Button>
	);
};

export default SaveFormButton;
