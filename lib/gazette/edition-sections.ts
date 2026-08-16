export const editionSections = [
    {
        title: "Welcome",
        heading: "Welcome back, Gefes!",
        slug: "welcome",
        fieldName: "welcomeBody",
        placeholder:
            "Start writing here. The AI Newsroom will suggest, never silently replace.",
        sortOrder: 0,
    },
    {
        title: "Chris' Corner",
        heading: "Chris' Corner",
        slug: "chris-corner",
        fieldName: "chrisCornerBody",
        placeholder: "Write Chris' Corner...",
        sortOrder: 1,
    },
    {
        title: "Bonehead Benching of the Week",
        heading: "Bonehead Benching of the Week",
        slug: "bonehead-benching",
        fieldName: "boneheadBenchingBody",
        placeholder:
            "Announce this week's Bonehead Benching winner and explain the lineup disaster...",
        sortOrder: 2,
    },
    {
        title: "Matchups of the Week",
        heading: "Matchups of the Week",
        slug: "matchups",
        fieldName: "matchupsBody",
        placeholder:
            "Recap this week's matchups, questionable decisions, and unnecessary drama...",
        sortOrder: 3,
    },
    {
        title: "Next Week's Picks",
        heading: "Next Week's Picks",
        slug: "next-weeks-picks",
        fieldName: "nextWeeksPicksBody",
        placeholder: "Write next week's picks...",
        sortOrder: 4,
    },
];

export const draftGradesSections = [
    {
        title: "Welcome",
        heading: "Draft Grades and Preseason Predictions",
        slug: "welcome",
        fieldName: "welcomeBody",
        placeholder:
            "Welcome the Gefes back, set the tone for the season, and explain how badly everyone drafted.",
        sortOrder: 0,
    },
    {
        title: "Manager Grades",
        heading: "Draft Grades and Preseason Predictions",
        slug: "manager-grades",
        fieldName: "managerGradesBody",
        placeholder:
            "Manager identity and drafted roster will eventually come from Yahoo. Write the Cheers, Jeers, and Preseason Prediction here.",
        sortOrder: 1,
    },
    {
        title: "Closing",
        heading: "Final Thoughts",
        slug: "closing",
        fieldName: "closingBody",
        placeholder:
            "Wrap up the preseason edition and send the Gefes into the season with false confidence.",
        sortOrder: 2,
    },
];

export const editionTemplates = {
    regularSeason: editionSections,
    draftGrades: draftGradesSections,
};