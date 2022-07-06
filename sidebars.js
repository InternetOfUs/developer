module.exports = {
    tech: [
        {
            type: 'category',
            label: 'Conversation',
            items: [
                'tech/conversation/app-logic',
                'tech/conversation/norms',
                'tech/conversation/models'
            ],
        },
        {
            type: 'category',
            label: 'App Development',
            items: [
                //'tech/app/intro',
                'tech/app/platform-api'
            ]
        },
        {
            type: 'category',
            label: 'Use cases',
            items: [
                'tech/usecase/ask-for-help',
                'tech/usecase/ask-for-helpv2',
                'tech/usecase/survey-app'
            ],
        },
        {
            type: 'category',
            label: 'Open Calls',
            items: [
                'tech/opencalls/ask-for-help',
            ],
        }
    ],
    pilot: [
        'platform/intro',
        'platform/hub',
        'platform/profile-manager',
        'platform/task-manager',
        'platform/interaction-protocol-engine',
        'platform/personal-context-builder',
        'platform/service-api',
        'platform/realtime',
        {
            type: 'category',
            label: 'Pilots',
            items: [
                'platform/pilots/m26'
            ],
        }
    ],
};
