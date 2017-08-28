const parseGitHubURL = gitHubURL => {
    let userRepoBranch

    // Extract 'user/repository [/tree/branch]' from github.com/ address
    const userRepo = gitHubURL.replace(/^.+\.com\/|\.git|\/$/g, '')

    // Check if the repo address defines direction to the exact branch
    if (userRepo.indexOf('tree') !== -1) {
        // user/repo/tree/branch [...] => user/repo/branch [...]
        userRepoBranch = userRepo.replace(/\/tree/, '')
    } else {
        // user/repo => user/repo/master
        userRepoBranch = `${userRepo}/master`
    }

    /* Return download-enabled address for the root of repository
       format: https://raw.githubusercontent.com/user/repository/branch/ */
    return `https://raw.githubusercontent.com/${userRepoBranch}/`
}

export default parseGitHubURL
