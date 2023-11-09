'use client';

import { FormSchemaType, formSchema } from '@/schemas/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { ImSpinner2 } from 'react-icons/im';
import { BsFileEarmarkPlus } from 'react-icons/bs';
import { Button } from './ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from './ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel } from './ui/form';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { useToast } from './ui/use-toast';
import { CreateForm } from '@/actions/form';
import { useRouter } from 'next/navigation';

const CreateFormButton = () => {
	const router = useRouter();
	const { toast } = useToast();

	const form = useForm<FormSchemaType>({
		resolver: zodResolver(formSchema),
	});

	const onSubmit = async (values: FormSchemaType) => {
		try {
			const formId = await CreateForm(values);
			toast({
				title: 'Success',
				description: 'New form created successfully',
			});
			router.push(`/builder/${formId}`);
		} catch (error) {
			toast({
				title: 'Error',
				description: 'Something went wrong, please try again later',
				variant: 'destructive',
			});
		}
	};

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button
					className='gorup border border-primary/20 h-[190px] items-center justify-center flex flex-col hover:border-primary hover:cursor-pointer border-dashed gap-4'
					variant='outline'
				>
					<BsFileEarmarkPlus className='h-8 w-8 text-muted-foreground group-hover:text-primary' />
					<p className='font-bold text-xl text-muted-foreground group-hover:text-primary'>
						Create New Form
					</p>
				</Button>
			</DialogTrigger>
			<DialogContent>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)}>
						<DialogHeader>
							<DialogTitle>Create Form</DialogTitle>
							<DialogDescription>
								Create a new form to start collecting responses
							</DialogDescription>
						</DialogHeader>
						<div className='space-y-2'>
							<FormField
								control={form.control}
								name='name'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Name</FormLabel>
										<FormControl>
											<Input {...field} />
										</FormControl>
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name='description'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Description</FormLabel>
										<FormControl>
											<Textarea rows={5} {...field} />
										</FormControl>
									</FormItem>
								)}
							/>
						</div>
						<DialogFooter>
							<Button
								type='submit'
								disabled={form.formState.isSubmitting}
								className='w-full mt-4'
							>
								{!form.formState.isSubmitting ? (
									<span>Save</span>
								) : (
									<ImSpinner2 className='animate-spin' />
								)}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};

export default CreateFormButton;
