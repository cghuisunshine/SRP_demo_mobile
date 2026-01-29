import { defineCollection, z } from 'astro:content';

const surveys = defineCollection({
    type: 'content',
    schema: z.object({
        title: z.string(),
        description: z.string(),
        icon: z.string(),
        questions: z.array(z.object({
            id: z.string(),
            text: z.string(),
            type: z.enum(['text', 'select', 'radio', 'boolean']),
            options: z.array(z.string()).optional(),
            isMandatory: z.boolean().default(true),
            helpText: z.string().optional(),
            dependsOn: z.object({
                questionId: z.string(),
                value: z.string(),
            }).optional(),
        })),
    }),
});

const documents = defineCollection({
    type: 'content',
    schema: z.object({
        title: z.string(),
        description: z.string(),
        categories: z.array(z.object({
            id: z.string(),
            name: z.string(),
            description: z.string(),
            type: z.enum(['mandatory', 'optional']),
        })),
    }),
});

const company = defineCollection({
    type: 'content',
    schema: z.object({
        role: z.enum(['admin', 'inspector', 'client']),
        dashboardTitle: z.string(),
        dashboardSubtitle: z.string(),
        quickActions: z.array(z.object({
            label: z.string(),
            icon: z.string(),
            href: z.string(),
        })),
    }),
});

export const collections = {
    'surveys': surveys,
    'documents': documents,
    'company': company,
};
