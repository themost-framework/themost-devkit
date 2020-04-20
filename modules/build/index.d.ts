
declare interface ExtraBuildOptions {
    configFile?: string;
    verbose?: boolean;
    quiet?: boolean;
    sourceMaps?: boolean;
}

/**
 * Build @themost/cli application by using @babel/cli
 * @param {string} projectDir 
 */
export declare function build(projectDir: string, buildOptions?: ExtraBuildOptions): Promise<void>;