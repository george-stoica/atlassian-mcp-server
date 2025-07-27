import { z } from 'zod';
export declare const JiraSearchOptionsSchema: z.ZodObject<{
    assignee: z.ZodOptional<z.ZodString>;
    creator: z.ZodOptional<z.ZodString>;
    createdAfter: z.ZodOptional<z.ZodString>;
    createdBefore: z.ZodOptional<z.ZodString>;
    project: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodString>;
    maxResults: z.ZodDefault<z.ZodNumber>;
    startAt: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    maxResults: number;
    startAt: number;
    assignee?: string | undefined;
    creator?: string | undefined;
    createdAfter?: string | undefined;
    createdBefore?: string | undefined;
    project?: string | undefined;
    status?: string | undefined;
}, {
    assignee?: string | undefined;
    creator?: string | undefined;
    createdAfter?: string | undefined;
    createdBefore?: string | undefined;
    project?: string | undefined;
    status?: string | undefined;
    maxResults?: number | undefined;
    startAt?: number | undefined;
}>;
export declare const JiraTicketFieldsSchema: z.ZodObject<{
    summary: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    status: z.ZodObject<{
        name: z.ZodString;
        statusCategory: z.ZodObject<{
            key: z.ZodString;
            name: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            name: string;
            key: string;
        }, {
            name: string;
            key: string;
        }>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        statusCategory: {
            name: string;
            key: string;
        };
    }, {
        name: string;
        statusCategory: {
            name: string;
            key: string;
        };
    }>;
    assignee: z.ZodOptional<z.ZodObject<{
        accountId: z.ZodString;
        displayName: z.ZodString;
        emailAddress: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        accountId: string;
        displayName: string;
        emailAddress: string;
    }, {
        accountId: string;
        displayName: string;
        emailAddress: string;
    }>>;
    creator: z.ZodObject<{
        accountId: z.ZodString;
        displayName: z.ZodString;
        emailAddress: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        accountId: string;
        displayName: string;
        emailAddress: string;
    }, {
        accountId: string;
        displayName: string;
        emailAddress: string;
    }>;
    reporter: z.ZodObject<{
        accountId: z.ZodString;
        displayName: z.ZodString;
        emailAddress: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        accountId: string;
        displayName: string;
        emailAddress: string;
    }, {
        accountId: string;
        displayName: string;
        emailAddress: string;
    }>;
    created: z.ZodString;
    updated: z.ZodString;
    priority: z.ZodObject<{
        name: z.ZodString;
        id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        name: string;
        id: string;
    }, {
        name: string;
        id: string;
    }>;
    issuetype: z.ZodObject<{
        name: z.ZodString;
        id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        name: string;
        id: string;
    }, {
        name: string;
        id: string;
    }>;
    project: z.ZodObject<{
        key: z.ZodString;
        name: z.ZodString;
        id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        name: string;
        key: string;
        id: string;
    }, {
        name: string;
        key: string;
        id: string;
    }>;
}, "strip", z.ZodTypeAny, {
    creator: {
        accountId: string;
        displayName: string;
        emailAddress: string;
    };
    project: {
        name: string;
        key: string;
        id: string;
    };
    status: {
        name: string;
        statusCategory: {
            name: string;
            key: string;
        };
    };
    summary: string;
    reporter: {
        accountId: string;
        displayName: string;
        emailAddress: string;
    };
    created: string;
    updated: string;
    priority: {
        name: string;
        id: string;
    };
    issuetype: {
        name: string;
        id: string;
    };
    assignee?: {
        accountId: string;
        displayName: string;
        emailAddress: string;
    } | undefined;
    description?: string | undefined;
}, {
    creator: {
        accountId: string;
        displayName: string;
        emailAddress: string;
    };
    project: {
        name: string;
        key: string;
        id: string;
    };
    status: {
        name: string;
        statusCategory: {
            name: string;
            key: string;
        };
    };
    summary: string;
    reporter: {
        accountId: string;
        displayName: string;
        emailAddress: string;
    };
    created: string;
    updated: string;
    priority: {
        name: string;
        id: string;
    };
    issuetype: {
        name: string;
        id: string;
    };
    assignee?: {
        accountId: string;
        displayName: string;
        emailAddress: string;
    } | undefined;
    description?: string | undefined;
}>;
export declare const JiraTicketSchema: z.ZodObject<{
    id: z.ZodString;
    key: z.ZodString;
    self: z.ZodString;
    fields: z.ZodObject<{
        summary: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        status: z.ZodObject<{
            name: z.ZodString;
            statusCategory: z.ZodObject<{
                key: z.ZodString;
                name: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                name: string;
                key: string;
            }, {
                name: string;
                key: string;
            }>;
        }, "strip", z.ZodTypeAny, {
            name: string;
            statusCategory: {
                name: string;
                key: string;
            };
        }, {
            name: string;
            statusCategory: {
                name: string;
                key: string;
            };
        }>;
        assignee: z.ZodOptional<z.ZodObject<{
            accountId: z.ZodString;
            displayName: z.ZodString;
            emailAddress: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            accountId: string;
            displayName: string;
            emailAddress: string;
        }, {
            accountId: string;
            displayName: string;
            emailAddress: string;
        }>>;
        creator: z.ZodObject<{
            accountId: z.ZodString;
            displayName: z.ZodString;
            emailAddress: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            accountId: string;
            displayName: string;
            emailAddress: string;
        }, {
            accountId: string;
            displayName: string;
            emailAddress: string;
        }>;
        reporter: z.ZodObject<{
            accountId: z.ZodString;
            displayName: z.ZodString;
            emailAddress: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            accountId: string;
            displayName: string;
            emailAddress: string;
        }, {
            accountId: string;
            displayName: string;
            emailAddress: string;
        }>;
        created: z.ZodString;
        updated: z.ZodString;
        priority: z.ZodObject<{
            name: z.ZodString;
            id: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            name: string;
            id: string;
        }, {
            name: string;
            id: string;
        }>;
        issuetype: z.ZodObject<{
            name: z.ZodString;
            id: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            name: string;
            id: string;
        }, {
            name: string;
            id: string;
        }>;
        project: z.ZodObject<{
            key: z.ZodString;
            name: z.ZodString;
            id: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            name: string;
            key: string;
            id: string;
        }, {
            name: string;
            key: string;
            id: string;
        }>;
    }, "strip", z.ZodTypeAny, {
        creator: {
            accountId: string;
            displayName: string;
            emailAddress: string;
        };
        project: {
            name: string;
            key: string;
            id: string;
        };
        status: {
            name: string;
            statusCategory: {
                name: string;
                key: string;
            };
        };
        summary: string;
        reporter: {
            accountId: string;
            displayName: string;
            emailAddress: string;
        };
        created: string;
        updated: string;
        priority: {
            name: string;
            id: string;
        };
        issuetype: {
            name: string;
            id: string;
        };
        assignee?: {
            accountId: string;
            displayName: string;
            emailAddress: string;
        } | undefined;
        description?: string | undefined;
    }, {
        creator: {
            accountId: string;
            displayName: string;
            emailAddress: string;
        };
        project: {
            name: string;
            key: string;
            id: string;
        };
        status: {
            name: string;
            statusCategory: {
                name: string;
                key: string;
            };
        };
        summary: string;
        reporter: {
            accountId: string;
            displayName: string;
            emailAddress: string;
        };
        created: string;
        updated: string;
        priority: {
            name: string;
            id: string;
        };
        issuetype: {
            name: string;
            id: string;
        };
        assignee?: {
            accountId: string;
            displayName: string;
            emailAddress: string;
        } | undefined;
        description?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    key: string;
    id: string;
    self: string;
    fields: {
        creator: {
            accountId: string;
            displayName: string;
            emailAddress: string;
        };
        project: {
            name: string;
            key: string;
            id: string;
        };
        status: {
            name: string;
            statusCategory: {
                name: string;
                key: string;
            };
        };
        summary: string;
        reporter: {
            accountId: string;
            displayName: string;
            emailAddress: string;
        };
        created: string;
        updated: string;
        priority: {
            name: string;
            id: string;
        };
        issuetype: {
            name: string;
            id: string;
        };
        assignee?: {
            accountId: string;
            displayName: string;
            emailAddress: string;
        } | undefined;
        description?: string | undefined;
    };
}, {
    key: string;
    id: string;
    self: string;
    fields: {
        creator: {
            accountId: string;
            displayName: string;
            emailAddress: string;
        };
        project: {
            name: string;
            key: string;
            id: string;
        };
        status: {
            name: string;
            statusCategory: {
                name: string;
                key: string;
            };
        };
        summary: string;
        reporter: {
            accountId: string;
            displayName: string;
            emailAddress: string;
        };
        created: string;
        updated: string;
        priority: {
            name: string;
            id: string;
        };
        issuetype: {
            name: string;
            id: string;
        };
        assignee?: {
            accountId: string;
            displayName: string;
            emailAddress: string;
        } | undefined;
        description?: string | undefined;
    };
}>;
export declare const JiraSearchResultSchema: z.ZodObject<{
    expand: z.ZodString;
    startAt: z.ZodNumber;
    maxResults: z.ZodNumber;
    total: z.ZodNumber;
    issues: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        key: z.ZodString;
        self: z.ZodString;
        fields: z.ZodObject<{
            summary: z.ZodString;
            description: z.ZodOptional<z.ZodString>;
            status: z.ZodObject<{
                name: z.ZodString;
                statusCategory: z.ZodObject<{
                    key: z.ZodString;
                    name: z.ZodString;
                }, "strip", z.ZodTypeAny, {
                    name: string;
                    key: string;
                }, {
                    name: string;
                    key: string;
                }>;
            }, "strip", z.ZodTypeAny, {
                name: string;
                statusCategory: {
                    name: string;
                    key: string;
                };
            }, {
                name: string;
                statusCategory: {
                    name: string;
                    key: string;
                };
            }>;
            assignee: z.ZodOptional<z.ZodObject<{
                accountId: z.ZodString;
                displayName: z.ZodString;
                emailAddress: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                accountId: string;
                displayName: string;
                emailAddress: string;
            }, {
                accountId: string;
                displayName: string;
                emailAddress: string;
            }>>;
            creator: z.ZodObject<{
                accountId: z.ZodString;
                displayName: z.ZodString;
                emailAddress: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                accountId: string;
                displayName: string;
                emailAddress: string;
            }, {
                accountId: string;
                displayName: string;
                emailAddress: string;
            }>;
            reporter: z.ZodObject<{
                accountId: z.ZodString;
                displayName: z.ZodString;
                emailAddress: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                accountId: string;
                displayName: string;
                emailAddress: string;
            }, {
                accountId: string;
                displayName: string;
                emailAddress: string;
            }>;
            created: z.ZodString;
            updated: z.ZodString;
            priority: z.ZodObject<{
                name: z.ZodString;
                id: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                name: string;
                id: string;
            }, {
                name: string;
                id: string;
            }>;
            issuetype: z.ZodObject<{
                name: z.ZodString;
                id: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                name: string;
                id: string;
            }, {
                name: string;
                id: string;
            }>;
            project: z.ZodObject<{
                key: z.ZodString;
                name: z.ZodString;
                id: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                name: string;
                key: string;
                id: string;
            }, {
                name: string;
                key: string;
                id: string;
            }>;
        }, "strip", z.ZodTypeAny, {
            creator: {
                accountId: string;
                displayName: string;
                emailAddress: string;
            };
            project: {
                name: string;
                key: string;
                id: string;
            };
            status: {
                name: string;
                statusCategory: {
                    name: string;
                    key: string;
                };
            };
            summary: string;
            reporter: {
                accountId: string;
                displayName: string;
                emailAddress: string;
            };
            created: string;
            updated: string;
            priority: {
                name: string;
                id: string;
            };
            issuetype: {
                name: string;
                id: string;
            };
            assignee?: {
                accountId: string;
                displayName: string;
                emailAddress: string;
            } | undefined;
            description?: string | undefined;
        }, {
            creator: {
                accountId: string;
                displayName: string;
                emailAddress: string;
            };
            project: {
                name: string;
                key: string;
                id: string;
            };
            status: {
                name: string;
                statusCategory: {
                    name: string;
                    key: string;
                };
            };
            summary: string;
            reporter: {
                accountId: string;
                displayName: string;
                emailAddress: string;
            };
            created: string;
            updated: string;
            priority: {
                name: string;
                id: string;
            };
            issuetype: {
                name: string;
                id: string;
            };
            assignee?: {
                accountId: string;
                displayName: string;
                emailAddress: string;
            } | undefined;
            description?: string | undefined;
        }>;
    }, "strip", z.ZodTypeAny, {
        key: string;
        id: string;
        self: string;
        fields: {
            creator: {
                accountId: string;
                displayName: string;
                emailAddress: string;
            };
            project: {
                name: string;
                key: string;
                id: string;
            };
            status: {
                name: string;
                statusCategory: {
                    name: string;
                    key: string;
                };
            };
            summary: string;
            reporter: {
                accountId: string;
                displayName: string;
                emailAddress: string;
            };
            created: string;
            updated: string;
            priority: {
                name: string;
                id: string;
            };
            issuetype: {
                name: string;
                id: string;
            };
            assignee?: {
                accountId: string;
                displayName: string;
                emailAddress: string;
            } | undefined;
            description?: string | undefined;
        };
    }, {
        key: string;
        id: string;
        self: string;
        fields: {
            creator: {
                accountId: string;
                displayName: string;
                emailAddress: string;
            };
            project: {
                name: string;
                key: string;
                id: string;
            };
            status: {
                name: string;
                statusCategory: {
                    name: string;
                    key: string;
                };
            };
            summary: string;
            reporter: {
                accountId: string;
                displayName: string;
                emailAddress: string;
            };
            created: string;
            updated: string;
            priority: {
                name: string;
                id: string;
            };
            issuetype: {
                name: string;
                id: string;
            };
            assignee?: {
                accountId: string;
                displayName: string;
                emailAddress: string;
            } | undefined;
            description?: string | undefined;
        };
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    maxResults: number;
    startAt: number;
    issues: {
        key: string;
        id: string;
        self: string;
        fields: {
            creator: {
                accountId: string;
                displayName: string;
                emailAddress: string;
            };
            project: {
                name: string;
                key: string;
                id: string;
            };
            status: {
                name: string;
                statusCategory: {
                    name: string;
                    key: string;
                };
            };
            summary: string;
            reporter: {
                accountId: string;
                displayName: string;
                emailAddress: string;
            };
            created: string;
            updated: string;
            priority: {
                name: string;
                id: string;
            };
            issuetype: {
                name: string;
                id: string;
            };
            assignee?: {
                accountId: string;
                displayName: string;
                emailAddress: string;
            } | undefined;
            description?: string | undefined;
        };
    }[];
    expand: string;
    total: number;
}, {
    maxResults: number;
    startAt: number;
    issues: {
        key: string;
        id: string;
        self: string;
        fields: {
            creator: {
                accountId: string;
                displayName: string;
                emailAddress: string;
            };
            project: {
                name: string;
                key: string;
                id: string;
            };
            status: {
                name: string;
                statusCategory: {
                    name: string;
                    key: string;
                };
            };
            summary: string;
            reporter: {
                accountId: string;
                displayName: string;
                emailAddress: string;
            };
            created: string;
            updated: string;
            priority: {
                name: string;
                id: string;
            };
            issuetype: {
                name: string;
                id: string;
            };
            assignee?: {
                accountId: string;
                displayName: string;
                emailAddress: string;
            } | undefined;
            description?: string | undefined;
        };
    }[];
    expand: string;
    total: number;
}>;
export declare const ConfluenceSearchOptionsSchema: z.ZodObject<{
    query: z.ZodString;
    spaceKey: z.ZodOptional<z.ZodString>;
    type: z.ZodDefault<z.ZodEnum<["page", "blogpost"]>>;
    limit: z.ZodDefault<z.ZodNumber>;
    start: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    type: "page" | "blogpost";
    query: string;
    limit: number;
    start: number;
    spaceKey?: string | undefined;
}, {
    query: string;
    type?: "page" | "blogpost" | undefined;
    spaceKey?: string | undefined;
    limit?: number | undefined;
    start?: number | undefined;
}>;
export declare const ConfluencePageSchema: z.ZodObject<{
    id: z.ZodString;
    type: z.ZodString;
    status: z.ZodString;
    title: z.ZodString;
    space: z.ZodObject<{
        id: z.ZodString;
        key: z.ZodString;
        name: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        name: string;
        key: string;
        id: string;
    }, {
        name: string;
        key: string;
        id: string;
    }>;
    version: z.ZodObject<{
        number: z.ZodNumber;
        when: z.ZodString;
        by: z.ZodObject<{
            type: z.ZodString;
            accountId: z.ZodString;
            displayName: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            type: string;
            accountId: string;
            displayName: string;
        }, {
            type: string;
            accountId: string;
            displayName: string;
        }>;
    }, "strip", z.ZodTypeAny, {
        number: number;
        when: string;
        by: {
            type: string;
            accountId: string;
            displayName: string;
        };
    }, {
        number: number;
        when: string;
        by: {
            type: string;
            accountId: string;
            displayName: string;
        };
    }>;
    _links: z.ZodObject<{
        webui: z.ZodString;
        self: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        self: string;
        webui: string;
    }, {
        self: string;
        webui: string;
    }>;
    _expandable: z.ZodOptional<z.ZodObject<{
        container: z.ZodString;
        metadata: z.ZodString;
        operations: z.ZodString;
        children: z.ZodString;
        restrictions: z.ZodString;
        history: z.ZodString;
        ancestors: z.ZodString;
        body: z.ZodString;
        descendants: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        container: string;
        metadata: string;
        operations: string;
        children: string;
        restrictions: string;
        history: string;
        ancestors: string;
        body: string;
        descendants: string;
    }, {
        container: string;
        metadata: string;
        operations: string;
        children: string;
        restrictions: string;
        history: string;
        ancestors: string;
        body: string;
        descendants: string;
    }>>;
}, "strip", z.ZodTypeAny, {
    status: string;
    type: string;
    id: string;
    title: string;
    space: {
        name: string;
        key: string;
        id: string;
    };
    version: {
        number: number;
        when: string;
        by: {
            type: string;
            accountId: string;
            displayName: string;
        };
    };
    _links: {
        self: string;
        webui: string;
    };
    _expandable?: {
        container: string;
        metadata: string;
        operations: string;
        children: string;
        restrictions: string;
        history: string;
        ancestors: string;
        body: string;
        descendants: string;
    } | undefined;
}, {
    status: string;
    type: string;
    id: string;
    title: string;
    space: {
        name: string;
        key: string;
        id: string;
    };
    version: {
        number: number;
        when: string;
        by: {
            type: string;
            accountId: string;
            displayName: string;
        };
    };
    _links: {
        self: string;
        webui: string;
    };
    _expandable?: {
        container: string;
        metadata: string;
        operations: string;
        children: string;
        restrictions: string;
        history: string;
        ancestors: string;
        body: string;
        descendants: string;
    } | undefined;
}>;
export declare const ConfluenceSearchResultSchema: z.ZodObject<{
    results: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        type: z.ZodString;
        status: z.ZodString;
        title: z.ZodString;
        space: z.ZodObject<{
            id: z.ZodString;
            key: z.ZodString;
            name: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            name: string;
            key: string;
            id: string;
        }, {
            name: string;
            key: string;
            id: string;
        }>;
        version: z.ZodObject<{
            number: z.ZodNumber;
            when: z.ZodString;
            by: z.ZodObject<{
                type: z.ZodString;
                accountId: z.ZodString;
                displayName: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                type: string;
                accountId: string;
                displayName: string;
            }, {
                type: string;
                accountId: string;
                displayName: string;
            }>;
        }, "strip", z.ZodTypeAny, {
            number: number;
            when: string;
            by: {
                type: string;
                accountId: string;
                displayName: string;
            };
        }, {
            number: number;
            when: string;
            by: {
                type: string;
                accountId: string;
                displayName: string;
            };
        }>;
        _links: z.ZodObject<{
            webui: z.ZodString;
            self: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            self: string;
            webui: string;
        }, {
            self: string;
            webui: string;
        }>;
        _expandable: z.ZodOptional<z.ZodObject<{
            container: z.ZodString;
            metadata: z.ZodString;
            operations: z.ZodString;
            children: z.ZodString;
            restrictions: z.ZodString;
            history: z.ZodString;
            ancestors: z.ZodString;
            body: z.ZodString;
            descendants: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            container: string;
            metadata: string;
            operations: string;
            children: string;
            restrictions: string;
            history: string;
            ancestors: string;
            body: string;
            descendants: string;
        }, {
            container: string;
            metadata: string;
            operations: string;
            children: string;
            restrictions: string;
            history: string;
            ancestors: string;
            body: string;
            descendants: string;
        }>>;
    }, "strip", z.ZodTypeAny, {
        status: string;
        type: string;
        id: string;
        title: string;
        space: {
            name: string;
            key: string;
            id: string;
        };
        version: {
            number: number;
            when: string;
            by: {
                type: string;
                accountId: string;
                displayName: string;
            };
        };
        _links: {
            self: string;
            webui: string;
        };
        _expandable?: {
            container: string;
            metadata: string;
            operations: string;
            children: string;
            restrictions: string;
            history: string;
            ancestors: string;
            body: string;
            descendants: string;
        } | undefined;
    }, {
        status: string;
        type: string;
        id: string;
        title: string;
        space: {
            name: string;
            key: string;
            id: string;
        };
        version: {
            number: number;
            when: string;
            by: {
                type: string;
                accountId: string;
                displayName: string;
            };
        };
        _links: {
            self: string;
            webui: string;
        };
        _expandable?: {
            container: string;
            metadata: string;
            operations: string;
            children: string;
            restrictions: string;
            history: string;
            ancestors: string;
            body: string;
            descendants: string;
        } | undefined;
    }>, "many">;
    start: z.ZodNumber;
    limit: z.ZodNumber;
    size: z.ZodNumber;
    _links: z.ZodObject<{
        base: z.ZodString;
        context: z.ZodString;
        self: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        self: string;
        base: string;
        context: string;
    }, {
        self: string;
        base: string;
        context: string;
    }>;
}, "strip", z.ZodTypeAny, {
    limit: number;
    start: number;
    _links: {
        self: string;
        base: string;
        context: string;
    };
    results: {
        status: string;
        type: string;
        id: string;
        title: string;
        space: {
            name: string;
            key: string;
            id: string;
        };
        version: {
            number: number;
            when: string;
            by: {
                type: string;
                accountId: string;
                displayName: string;
            };
        };
        _links: {
            self: string;
            webui: string;
        };
        _expandable?: {
            container: string;
            metadata: string;
            operations: string;
            children: string;
            restrictions: string;
            history: string;
            ancestors: string;
            body: string;
            descendants: string;
        } | undefined;
    }[];
    size: number;
}, {
    limit: number;
    start: number;
    _links: {
        self: string;
        base: string;
        context: string;
    };
    results: {
        status: string;
        type: string;
        id: string;
        title: string;
        space: {
            name: string;
            key: string;
            id: string;
        };
        version: {
            number: number;
            when: string;
            by: {
                type: string;
                accountId: string;
                displayName: string;
            };
        };
        _links: {
            self: string;
            webui: string;
        };
        _expandable?: {
            container: string;
            metadata: string;
            operations: string;
            children: string;
            restrictions: string;
            history: string;
            ancestors: string;
            body: string;
            descendants: string;
        } | undefined;
    }[];
    size: number;
}>;
export declare const AtlassianConfigSchema: z.ZodObject<{
    jira: z.ZodObject<{
        baseUrl: z.ZodString;
        email: z.ZodString;
        apiToken: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        baseUrl: string;
        email: string;
        apiToken: string;
    }, {
        baseUrl: string;
        email: string;
        apiToken: string;
    }>;
    confluence: z.ZodObject<{
        baseUrl: z.ZodString;
        email: z.ZodString;
        apiToken: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        baseUrl: string;
        email: string;
        apiToken: string;
    }, {
        baseUrl: string;
        email: string;
        apiToken: string;
    }>;
}, "strip", z.ZodTypeAny, {
    jira: {
        baseUrl: string;
        email: string;
        apiToken: string;
    };
    confluence: {
        baseUrl: string;
        email: string;
        apiToken: string;
    };
}, {
    jira: {
        baseUrl: string;
        email: string;
        apiToken: string;
    };
    confluence: {
        baseUrl: string;
        email: string;
        apiToken: string;
    };
}>;
export type JiraSearchOptionsInput = z.input<typeof JiraSearchOptionsSchema>;
export type JiraSearchOptions = z.output<typeof JiraSearchOptionsSchema>;
export type ConfluenceSearchOptionsInput = z.input<typeof ConfluenceSearchOptionsSchema>;
export type ConfluenceSearchOptions = z.output<typeof ConfluenceSearchOptionsSchema>;
