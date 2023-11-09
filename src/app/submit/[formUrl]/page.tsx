import { GetFormContentByUrl } from '@/actions/form';
import { FormElementInstance } from '@/components/FormElements';
import FormSubmit from '@/components/FormSubmit';
import React from 'react';

const SubmitFormPage = async ({
	params,
}: {
	params: {
		formUrl: string;
	};
}) => {
	const form = await GetFormContentByUrl(params.formUrl);

	if (!form) throw new Error('Form not found');

	const formContent = form.content as FormElementInstance[];

	return <FormSubmit formUrl={params.formUrl} content={formContent} />;
};

export default SubmitFormPage;
