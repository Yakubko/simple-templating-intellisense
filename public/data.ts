const dataStructure = (function () {
    const user = {},
        article = {};

    Object.assign(user, {
        name: { title: 'Name', description: 'Unique name', nestedData: null, priority: 1 },
        title: { title: 'Title', description: 'Display name', nestedData: null, priority: 2 },
        bb: { title: 'bb: Priority: 4', description: 'Display name', nestedData: null, priority: 4 },
        aaa: { title: 'aaa: Priority: 4', description: 'Display name', nestedData: null, priority: 4 },
        cc: { title: 'c: Priority: empty', description: 'Display name', nestedData: null },
        aa: { title: 'aa: Priority: empty', description: 'Display name', nestedData: null },
    });

    Object.assign(article, {
        name: { title: 'Name', description: 'Unique name', nestedData: null },
        title: { title: 'Title', description: 'Article title', nestedData: null },
        user: { title: 'User', description: null, nestedData: user },
    });

    return { user, article };
})();

export default dataStructure;
